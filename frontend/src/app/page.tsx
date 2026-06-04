import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-5xl font-bold tracking-tight">EduChain</h1>
      <p className="mt-4 text-xl text-gray-400">
        Nigerian university certificates, impossible to fake and impossible to lose —
        on-chain, gated behind real student-ID verification.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/onboarding"
          className="rounded-lg bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500"
        >
          Verify your student ID →
        </Link>
      </div>

      <ul className="mt-16 space-y-4 text-gray-300">
        <li>🎓 Fake certificates? Every cert lives on-chain, tied to a verified student ID.</li>
        <li>💼 Lost credentials? They're in your wallet, not on a portal that can die.</li>
        <li>🌐 Portal crashes? Enrollment is token ownership — the chain is always on.</li>
        <li>💸 Global pay? Tutors get paid in seconds via Solana, no PayPal drama.</li>
      </ul>

      <p className="mt-16 text-sm text-gray-500">
        Math doesn&apos;t lie. Blockchain doesn&apos;t accept bribes. That&apos;s the whole point.
      </p>
    </main>
  );
}
