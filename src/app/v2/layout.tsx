import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";
import { Navbar } from "@/v2/components/layout/navbar";
import { Footer } from "@/v2/components/layout/footer";
import { siteConfig } from "@/v2/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const canAccessAdmin = isAdminEmail(
    user?.primaryEmailAddress?.emailAddress ?? null
  );

  return (
    <div className="v2-theme">
      <Navbar canAccessAdmin={canAccessAdmin} />
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      <Footer />
    </div>
  );
}
