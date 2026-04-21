import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://offseclabs.xyz"),
  title: "OffSecLabs",
  description:
    "Minimal landing page for offseclabs.xyz, built for offensive security research, fast deployment on Vercel, and future Neon-backed content.",
  openGraph: {
    title: "OffSecLabs",
    description:
      "A minimal home for offensive security research and experiments.",
    url: "https://offseclabs.xyz",
    siteName: "OffSecLabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OffSecLabs",
    description:
      "A minimal home for offensive security research and experiments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
