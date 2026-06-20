"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#9E2102] to-[#E85E1D] flex items-center justify-center text-white font-black text-xl mb-6">
        EDX
      </div>
      <h1 className="text-4xl font-[900] mb-2">404</h1>
      <p className="text-[#737373] mb-6">Page not found</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#9E2102] text-white text-[13px] font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
