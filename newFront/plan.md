# Implementation Plan - EduChain Web3 Education Platform

Build a production-ready UI/UX system for EduChain, a decentralized academic credential platform for Nigerian university students using Solana, DID, and NFT/SFT course ownership.

## Scope Summary
- **Visual Identity**: Dark institutional theme, #0D1117 background, strict 8px grid, "Outfit" & "JetBrains Mono" typography.
- **Core Features**: Wallet authentication, Onboarding (Matric verification -> DID creation -> Wallet binding), Learner & Instructor Dashboards, Marketplace, Learning Interface, Certificate System, and Employer Verification.
- **Infrastructure**: Frontend-only mock of blockchain interactions (loading -> success states), DID generation simulations, and local state management for persistence.

## Non-Goals
- Real Solana smart contract integration (simulated only).
- Actual backend database/Supabase (local storage/mock data only).
- Real-time video streaming (placeholder players).

## Assumptions & Risks
- **Persistence**: All data will be kept in `localStorage`.
- **UI Framework**: React + Tailwind CSS + Lucide Icons + Shadcn/UI (already present).
- **DID/Wallet**: Simulated using JetBrains Mono strings and mock hashes.

## Affected Areas
- `src/index.css`: Global theme, dark mode tokens, typography (Outfit/JetBrains Mono).
- `src/components/educhain/*`: New reusable Web3/Institutional components.
- `src/pages/*`: Multi-page layout (Landing, Dashboard, Marketplace, DID Profile, Verification).
- `src/hooks/*`: Mock hooks for wallet/DID state.

## Phase 1: Foundation & Design System (frontend_engineer)
- Update `index.css` with the specified color system (#0D1117, #161B22, #21262D) and "Outfit" font.
- Create core layout wrappers: `MainLayout` (sidebar/topbar) and `PublicLayout` (landing).
- Implement global components:
  - `WalletAddressChip` (truncated, copy icon)
  - `VerifiedStudentBadge` (green shield)
  - `DIDString` (monospace chip)
  - `OnChainBadge` (Solana logo)

## Phase 2: Landing & Onboarding (frontend_engineer)
- **Landing Page**: Hero section, "Own Your Learning" message, Feature strip.
- **Wallet Connection**: Modal with simulated Phantom/MetaMask connection states.
- **Onboarding (4-step wizard)**:
  - Step 1: Matriculation verification (mock regex).
  - Step 2: Animated DID generation sequence.
  - Step 3: Wallet binding animation.
  - Step 4: Role selection (Learner/Instructor).

## Phase 3: Learner Dashboard & Marketplace (frontend_engineer)
- **Dashboard**: Metric cards, Welcome banner, "Continue Learning" progress cards.
- **Marketplace**: Search, Filter (NFT/SFT), Course grid with price in SOL/USD.
- **Course Detail**: Curriculum accordion, Ownership explanation (NFT/SFT), Transaction preview.
- **Learning Interface**: Mock video player with lesson list and notes.

## Phase 4: DID Profile & Employer Verification (frontend_engineer)
- **DID Profile**: Avatar from hash, Reputation ring, Credentials tab, Activity timeline.
- **Employer Verification**: Public page with input for DID/Cert ID and multiple result states (Valid/Invalid/Revoked).
- **Certificates**: Grid of verifiable certificates with explorer links.

## Phase 5: Instructor Dashboard & Settings (frontend_engineer)
- **Instructor Dashboard**: Revenue metrics (SOL/NGN), Course management (Live/Draft).
- **Course Builder**: Form for curriculum, NFT/SFT toggle, Royalty slider.
- **Settings**: Privacy toggles, Wallet re-binding, DID management.

## Phase 6: Final Polishing & Persistence (quick_fix_engineer)
- Ensure 8px grid strictness.
- Add "hover lift" to cards.
- Implement glassmorphism for modals (80% opacity, backdrop-blur).
- Hook up `localStorage` to persist "Enrolled" states and "DID" identity across refreshes.
- Final responsive check (Sidebar collapse to icon rail).
