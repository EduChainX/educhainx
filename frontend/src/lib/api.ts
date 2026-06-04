// Thin fetch wrapper around the Go API. Keep all endpoint strings here so the rest of the
// app never hardcodes a URL.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export type VerifyResult =
  | { verified: true; did: string; challenge: string }
  | { verified: false };

export async function verifyMatric(matric: string): Promise<VerifyResult> {
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ matric }),
  });
  return res.json();
}

export async function bindWallet(did: string, wallet: string, signature: string) {
  const res = await fetch(`${BASE}/bind`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ did, wallet, signature }),
  });
  return res.json();
}

export type Course = {
  id: string;
  title: string;
  description: string;
  price_lamports: number;
  token_type: "nft" | "sft";
  content_cid: string;
};

export async function listCourses(): Promise<{ courses: Course[] }> {
  const res = await fetch(`${BASE}/courses`);
  return res.json();
}
