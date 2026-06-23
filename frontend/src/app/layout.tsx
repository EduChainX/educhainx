import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { WalletProviders } from "@/components/WalletProviders";
import { ClientShell } from "@/components/educhain/client-shell";
import { SidebarProvider } from "@/components/educhain/sidebar-context";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading-var",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-var",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduChainX",
  description: "Nigerian university credentials, impossible to fake or lose.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${poppins.variable}`} suppressHydrationWarning data-theme="dark">
      <body className="pb-20 lg:pb-0">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletProviders>
            <SidebarProvider>
              <ClientShell>{children}</ClientShell>
            </SidebarProvider>
          </WalletProviders>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
