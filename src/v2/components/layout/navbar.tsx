"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";
import { MobileMenu } from "@/v2/components/layout/mobile-menu";

const navLinks = [
  { href: "/v2/blog", label: "Research" },
  { href: "/v2/labs", label: "Labs" },
  { href: "/v2/tools", label: "Tools" },
  { href: "/v2/about", label: "About" },
];

type NavbarProps = {
  canAccessAdmin: boolean;
};

export function Navbar({ canAccessAdmin }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/v2"
          className="text-sm font-medium uppercase tracking-[0.28em] text-stone-200 transition hover:text-white"
        >
          OffSecLabs
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "text-white"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-1 -bottom-[9px] h-px bg-lime-300/60" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {canAccessAdmin ? (
            <Link
              href="/v2/admin"
              prefetch={false}
              className="hidden rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-stone-300 transition hover:border-white/20 hover:text-white md:inline-flex"
            >
              Admin
            </Link>
          ) : null}

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-stone-300 transition hover:border-white/20 hover:text-white">
                Sign in
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-5 bg-stone-300 transition-all ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-stone-300 transition-all ${mobileOpen ? "-translate-y-[2px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        canAccessAdmin={canAccessAdmin}
      />
    </header>
  );
}
