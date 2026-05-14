export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://offseclabs.xyz",
  name: "OffSecLabs",
  description:
    "A minimal home for offensive security research and experiments.",
  social: {
    github: "https://github.com/offseclabs",
    twitter: "https://twitter.com/offseclabs",
    email: "hello@offseclabs.xyz",
  },
} as const;
