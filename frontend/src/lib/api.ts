// Thin fetch wrapper around the Go API. Keep all endpoint strings here so the rest of the
// app never hardcodes a URL.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export type VerifyResult =
  | { verified: true; did: string; challenge: string }
  | { verified: false };

/** Verifies a matric number against the institutional registry and returns a DID + challenge. */
export async function verifyMatric(matric: string): Promise<VerifyResult> {
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ matric }),
  });
  return res.json();
}

/** Binds a Solana wallet to a verified DID using a signed challenge. */
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
  mint?: string;
  instructor_did?: string;
  instructor_name?: string;
  title: string;
  description: string;
  category?: string;
  level?: string;
  tags?: string[];
  price_lamports: number;
  token_type: "nft" | "sft";
  supply?: number;
  sold?: number;
  available_seats?: number;
  royalty_bps?: number;
  platform_bps?: number;
  content_cid: string;
  image_url?: string;
  rating?: number;
  learner_count?: number;
  available?: boolean;
  related_course_ids?: string[];
};

/** Fetches all courses from the Go API. */
export async function listCourses(): Promise<{ courses: Course[] }> {
  const res = await fetch(`${BASE}/courses`);
  return res.json();
}

/** Fetches currently available marketplace courses from the Go API. */
export async function listMarketplaceCourses(): Promise<{ courses: Course[] }> {
  const res = await fetch(`${BASE}/marketplace/courses`);
  return res.json();
}

/** Fetches related available courses for a selected course. */
export async function listRelatedCourses(id: string): Promise<{ courses: Course[] }> {
  const res = await fetch(`${BASE}/courses/${encodeURIComponent(id)}/related`);
  return res.json();
}

export type VerificationRecord = {
  provider: "sheerid_mock";
  status: "pending" | "verified" | "rejected";
  reference: string;
  proof_hash: string;
  checked_at: string;
  failure_reason?: string;
};

export type Student = {
  id: string;
  name: string;
  account_name: string;
  email?: string;
  matric?: string;
  did?: string;
  wallet?: string;
  selected_course_id: string;
  selected_course?: Course;
  related_courses?: Course[];
  verification: VerificationRecord;
  student_hash: string;
  on_chain_network: string;
  on_chain_status: string;
  created_at: string;
  updated_at: string;
};

export type OnboardStudentInput = {
  name: string;
  account_name: string;
  email?: string;
  matric: string;
  did?: string;
  wallet?: string;
  selected_course_id: string;
  sheerid_proof: string;
};

/** Mock SheerID verification hook; replace backend adapter when real credentials are available. */
export async function verifySheerID(input: {
  matric: string;
  email?: string;
  sheerid_proof: string;
}): Promise<{ verification: VerificationRecord }> {
  const res = await fetch(`${BASE}/sheerid/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

/** Creates/updates a student onboarding record with selected course and proof status. */
export async function onboardStudent(input: OnboardStudentInput): Promise<{ student: Student }> {
  const res = await fetch(`${BASE}/students/onboard`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function getStudent(id: string): Promise<Student> {
  const res = await fetch(`${BASE}/students/${encodeURIComponent(id)}`);
  return res.json();
}

export async function getStudentByWallet(wallet: string): Promise<Student> {
  const res = await fetch(`${BASE}/wallets/${encodeURIComponent(wallet)}/student`);
  return res.json();
}

export type SolanaConfig = {
  cluster: "devnet" | "testnet" | "mainnet" | "localnet" | string;
  rpc: string;
  program_id: string;
};

export async function getSolanaConfig(): Promise<SolanaConfig> {
  const res = await fetch(`${BASE}/solana/config`);
  return res.json();
}

export type CertResult = {
  did: string;
  course: string;
  valid: boolean;
  note?: string;
};

// Public credential check (employer-facing). Backend route: GET /verify-cert/:did/:course.
/** Public credential check — verifies a certificate against the on-chain registry. */
export async function verifyCert(did: string, course: string): Promise<CertResult> {
  const res = await fetch(`${BASE}/verify-cert/${encodeURIComponent(did)}/${encodeURIComponent(course)}`);
  return res.json();
}
