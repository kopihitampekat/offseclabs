import Link from "next/link";
import { siteConfig } from "@/v2/lib/config";

const footerLinks = [
  { href: "/v2/blog", label: "Research" },
  { href: "/v2/labs", label: "Labs" },
  { href: "/v2/tools", label: "Tools" },
  { href: "/v2/about", label: "About" },
];

const socialLinks = [
  { href: siteConfig.social.github, label: "GitHub" },
  { href: siteConfig.social.twitter, label: "Twitter" },
  { href: `mailto:${siteConfig.social.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060606]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link
              href="/v2"
              className="text-sm font-medium uppercase tracking-[0.28em] text-stone-300"
            >
              OffSecLabs
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-7 text-stone-500">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 transition hover:text-stone-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.24em] text-stone-400">
              Connect
            </h3>
            <ul className="mt-3 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-500 transition hover:text-stone-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-stone-600">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <a
            href="/v2/feed.xml"
            className="text-xs text-stone-600 transition hover:text-stone-400"
          >
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  );
}
