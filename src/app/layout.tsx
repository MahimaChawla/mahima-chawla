import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Mahima · Engineering systems and ways to understand them",
  description:
    "Designing resilient backend systems, visual tools, and interactive learning experiences.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "min-h-screen bg-[#f4edde] text-[#231814] antialiased",
          fontSans.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#d2c2ad] py-6 text-center text-xs text-[#8a7a68]">
            © {new Date().getFullYear()} Mahima. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
