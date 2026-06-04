// The moat, as a 2-step flow:
//   1. enter matric -> backend verifies against the registry, hands back a DID + challenge
//   2. connect wallet -> sign the challenge -> wallet is now the verified student identity
"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { verifyMatric, bindWallet } from "@/lib/api";

type Step = "matric" | "wallet" | "done";

export default function Onboarding() {
  const { publicKey, signMessage } = useWallet();
  const [step, setStep] = useState<Step>("matric");
  const [matric, setMatric] = useState("");
  const [did, setDid] = useState("");
  const [challenge, setChallenge] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await verifyMatric(matric.trim());
      if (!res.verified) {
        setError("That matric number isn't in the registry. Double-check it.");
        return;
      }
      setDid(res.did);
      setChallenge(res.challenge);
      setStep("wallet");
    } catch {
      setError("Backend unreachable — is the Go server running on :8080?");
    } finally {
      setBusy(false);
    }
  }

  async function onBind() {
    if (!publicKey || !signMessage) {
      setError("Connect a wallet first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // sign the challenge to prove this wallet is ours, then bind it to the DID
      const sig = await signMessage(new TextEncoder().encode(challenge));
      const signature = Buffer.from(sig).toString("base64");
      await bindWallet(did, publicKey.toBase58(), signature);
      setStep("done");
    } catch {
      setError("Signing was rejected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold">Verify your student ID</h1>

      {step === "matric" && (
        <form onSubmit={onVerify} className="mt-8 space-y-4">
          <label className="block text-sm text-gray-400">Matriculation number</label>
          <input
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
            placeholder="FUTO/2021/12345"
            className="w-full rounded-lg bg-gray-800 px-4 py-3 outline-none"
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {busy ? "Checking the registry…" : "Verify"}
          </button>
        </form>
      )}

      {step === "wallet" && (
        <div className="mt-8 space-y-4">
          <p className="text-green-400">✓ Verified. DID: {did}</p>
          <p className="text-sm text-gray-400">
            Now connect your wallet and sign — this binds the wallet to your verified identity.
          </p>
          <WalletMultiButton />
          <button
            onClick={onBind}
            disabled={busy || !publicKey}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {busy ? "Binding…" : "Sign & bind wallet"}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="mt-8 space-y-2">
          <p className="text-2xl">🎉 You&apos;re in.</p>
          <p className="text-gray-400">
            Your wallet is now your verified student identity. From here on, just connect —
            no more matric number.
          </p>
        </div>
      )}

      {error && <p className="mt-6 text-red-400">{error}</p>}
    </main>
  );
}
