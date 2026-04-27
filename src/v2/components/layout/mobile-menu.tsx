"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/v2/blog", label: "Research" },
  { href: "/v2/labs", label: "Labs" },
  { href: "/v2/tools", label: "Tools" },
  { href: "/v2/about", label: "About" },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  canAccessAdmin: boolean;
};

export function MobileMenu({ open, onClose, canAccessAdmin }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-[#111111] p-6 shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Menu
              </span>
              <button
                onClick={onClose}
                className="text-stone-400 transition hover:text-white"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 space-y-1">
              {navLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-white/5 text-white"
                        : "text-stone-400 hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {canAccessAdmin ? (
                <Link
                  href="/v2/admin"
                  onClick={onClose}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-400 transition hover:bg-white/[0.03] hover:text-white"
                >
                  Admin
                </Link>
              ) : null}
            </nav>

            <div className="mt-8 border-t border-white/[0.06] pt-6">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-lime-200">
                    Sign in
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm text-stone-400">Signed in</span>
                </div>
              </Show>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
