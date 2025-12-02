import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Mahima · Home",
  description: "My little corner of the internet.",
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
          "min-h-screen bg-slate-950 text-slate-50 antialiased",
          fontSans.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Mahima. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
