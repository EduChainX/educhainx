import "./globals.css";
import type { Metadata } from "next";
import { WalletProviders } from "@/components/WalletProviders";

export const metadata: Metadata = {
  title: "EduChain",
  description: "Nigerian university credentials, impossible to fake or lose.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
