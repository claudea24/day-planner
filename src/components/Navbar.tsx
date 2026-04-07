"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTodayString } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const today = getTodayString();

  const navLinks = [
    { href: "/", label: "Todo List" },
    { href: `/day/${today}`, label: "Day", match: "/day" },
    { href: "/week", label: "Week" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Day Planner
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.match
              ? pathname.startsWith(link.match)
              : link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/add"
            className="ml-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Item
          </Link>
        </div>
      </div>
    </nav>
  );
}
