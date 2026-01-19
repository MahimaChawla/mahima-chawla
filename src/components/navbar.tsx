"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/deployment", label: "Where's it running?" },
  { href: "/failure-shapes", label: "Failure Shapes" },
  { href: "/catch-the-exception", label: "Catch!" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#d2c2ad] bg-[#f4edde]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[#231814]"
        >
          Mahima Chawla
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pb-0.5 text-[#6a5a4b] transition hover:text-[#231814]",
                  active &&
                    "border-b border-[#231814] text-[#231814]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
