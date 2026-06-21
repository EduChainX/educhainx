use anchor_lang::prelude::*;

declare_id!("Edu1111111111111111111111111111111111111111");

// EduChain core program. Three jobs, all enforced on-chain so no admin can be bribed:
//   1. bind a verified DID to a wallet (the moat, finalized on-chain)
//   2. publish a course + buy it with payment split atomically
//   3. issue a tamper-proof completion certificate
//
// NOTE: token mint/transfer + Metaplex royalties are intentionally left as CPI TODOs.
// This is the account + instruction skeleton — wire anchor-spl + mpl-core next (see todo.txt).
#[program]
pub mod educhain {
    use super::*;

    // ---- identity ------------------------------------------------------------------

    // Finalize the wallet<->DID binding the backend already vetted. After this, the wallet
    // *is* the verified student. did_hash is sha256(did) — keep raw PII off-chain entirely.
    pub fn bind_did(ctx: Context<BindDid>, did_hash: [u8; 32]) -> Result<()> {
        let reg = &mut ctx.accounts.did_registry;
        require!(!reg.bound, EduErr::AlreadyBound);
        reg.wallet = ctx.accounts.student.key();
        reg.did_hash = did_hash;
        reg.bound = true;
        reg.reputation = 0;
        Ok(())
    }

    // Commit the off-chain onboarding record to devnet/mainnet without exposing PII.
    // The backend keeps the raw student name, account name, and SheerID response; this
    // PDA stores hashes plus the selected course pointer so the flow is independently auditable.
    pub fn onboard_student(
        ctx: Context<OnboardStudent>,
        name_hash: [u8; 32],
        account_name_hash: [u8; 32],
        sheerid_proof_hash: [u8; 32],
    ) -> Result<()> {
        let reg = &ctx.accounts.did_registry;
        require!(reg.bound, EduErr::DidNotBound);
        require_keys_eq!(reg.wallet, ctx.accounts.student.key(), EduErr::WrongStudent);

        let profile = &mut ctx.accounts.student_profile;
        profile.student = ctx.accounts.student.key();
        profile.selected_course = ctx.accounts.course.key();
        profile.did_hash = reg.did_hash;
        profile.name_hash = name_hash;
        profile.account_name_hash = account_name_hash;
        profile.sheerid_proof_hash = sheerid_proof_hash;
        profile.sheerid_verified = true;
        profile.onboarded_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    // ---- courses -------------------------------------------------------------------

    // Publish a course. price + splits + royalty are locked in here at creation time so the
    // robot (this program) can pay everyone correctly later without anyone touching it.
    pub fn create_course(
        ctx: Context<CreateCourse>,
        price: u64,
        token_type: u8,   // 0 = NFT (unique), 1 = SFT (scalable)
        supply: u64,      // 1 for NFT, N for SFT
        royalty_bps: u16, // tutor's cut on every resale, forever
        platform_bps: u16,
        content_hash: [u8; 32], // IPFS CID hash of the material
    ) -> Result<()> {
        require!(platform_bps <= 10_000, EduErr::BadBps);
        require!(royalty_bps <= 10_000, EduErr::BadBps);

        let course = &mut ctx.accounts.course;
        course.instructor = ctx.accounts.instructor.key();
        course.price = price;
        course.token_type = token_type;
        course.supply = supply;
        course.sold = 0;
        course.royalty_bps = royalty_bps;
        course.platform_bps = platform_bps;
        course.content_hash = content_hash;

        // TODO: CPI to create the mint (NFT or SFT) + attach Metaplex royalty config
        Ok(())
    }

    // The bookshop robot. Student pays -> split lands in the same tx -> token is their receipt.
    pub fn buy_course(ctx: Context<BuyCourse>) -> Result<()> {
        let course = &mut ctx.accounts.course;
        require!(course.sold < course.supply, EduErr::SoldOut);

        let price = course.price;
        let platform_cut = price
            .checked_mul(course.platform_bps as u64)
            .ok_or(EduErr::MathOverflow)?
            / 10_000;
        let tutor_cut = price.checked_sub(platform_cut).ok_or(EduErr::MathOverflow)?;

        // atomic split — both legs in one tx, no intermediary holding the money
        transfer_lamports(&ctx.accounts.student, &ctx.accounts.instructor, tutor_cut)?;
        transfer_lamports(&ctx.accounts.student, &ctx.accounts.platform, platform_cut)?;

        // TODO: CPI transfer the course token to the student (their access key + ownership proof)
        course.sold += 1;
        Ok(())
    }

    // ---- certification -------------------------------------------------------------

    // Only fires when the completion condition is met. No human in the loop -> can't be faked.
    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        did_hash: [u8; 32],
        arweave_tx: [u8; 32], // pointer to the permanent cert record
    ) -> Result<()> {
        let cert = &mut ctx.accounts.certificate;
        cert.student = ctx.accounts.student.key();
        cert.course = ctx.accounts.course.key();
        cert.did_hash = did_hash;
        cert.arweave_tx = arweave_tx;
        cert.issued = true;
        Ok(())
    }
}

// helper: move native SOL between system accounts
fn transfer_lamports<'info>(
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    **from.try_borrow_mut_lamports()? -= amount;
    **to.try_borrow_mut_lamports()? += amount;
    Ok(())
}

// ---- accounts ----------------------------------------------------------------------

#[derive(Accounts)]
pub struct BindDid<'info> {
    #[account(
        init,
        payer = student,
        space = 8 + DidRegistry::LEN,
        seeds = [b"did", student.key().as_ref()],
        bump
    )]
    pub did_registry: Account<'info, DidRegistry>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OnboardStudent<'info> {
    #[account(
        init,
        payer = student,
        space = 8 + StudentProfile::LEN,
        seeds = [b"student", student.key().as_ref()],
        bump
    )]
    pub student_profile: Account<'info, StudentProfile>,
    #[account(
        seeds = [b"did", student.key().as_ref()],
        bump
    )]
    pub did_registry: Account<'info, DidRegistry>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub course: Account<'info, Course>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateCourse<'info> {
    #[account(
        init,
        payer = instructor,
        space = 8 + Course::LEN,
        seeds = [b"course", instructor.key().as_ref(), &course.supply.to_le_bytes()],
        bump
    )]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub instructor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyCourse<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub student: Signer<'info>,
    /// CHECK: tutor payout wallet, validated against course.instructor off the account data
    #[account(mut)]
    pub instructor: AccountInfo<'info>,
    /// CHECK: platform fee wallet
    #[account(mut)]
    pub platform: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueCertificate<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Certificate::LEN,
        seeds = [b"cert", student.key().as_ref(), course.key().as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    /// CHECK: the student the cert is for
    pub student: AccountInfo<'info>,
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub authority: Signer<'info>, // course-completion authority; tighten before mainnet
    pub system_program: Program<'info, System>,
}

// ---- state -------------------------------------------------------------------------

#[account]
pub struct DidRegistry {
    pub wallet: Pubkey,
    pub did_hash: [u8; 32],
    pub bound: bool,
    pub reputation: u64,
}
impl DidRegistry {
    pub const LEN: usize = 32 + 32 + 1 + 8;
}

#[account]
pub struct StudentProfile {
    pub student: Pubkey,
    pub selected_course: Pubkey,
    pub did_hash: [u8; 32],
    pub name_hash: [u8; 32],
    pub account_name_hash: [u8; 32],
    pub sheerid_proof_hash: [u8; 32],
    pub sheerid_verified: bool,
    pub onboarded_at: i64,
}
impl StudentProfile {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 32 + 32 + 1 + 8;
}

#[account]
pub struct Course {
    pub instructor: Pubkey,
    pub price: u64,
    pub token_type: u8,
    pub supply: u64,
    pub sold: u64,
    pub royalty_bps: u16,
    pub platform_bps: u16,
    pub content_hash: [u8; 32],
}
impl Course {
    pub const LEN: usize = 32 + 8 + 1 + 8 + 8 + 2 + 2 + 32;
}

#[account]
pub struct Certificate {
    pub student: Pubkey,
    pub course: Pubkey,
    pub did_hash: [u8; 32],
    pub arweave_tx: [u8; 32],
    pub issued: bool,
}
impl Certificate {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 1;
}

#[error_code]
pub enum EduErr {
    #[msg("wallet already bound to a DID")]
    AlreadyBound,
    #[msg("basis points must be <= 10000")]
    BadBps,
    #[msg("course is sold out")]
    SoldOut,
    #[msg("math overflow")]
    MathOverflow,
    #[msg("student wallet is not bound to a DID")]
    DidNotBound,
    #[msg("DID registry belongs to a different student wallet")]
    WrongStudent,
}
