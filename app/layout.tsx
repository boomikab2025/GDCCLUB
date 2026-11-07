import type { Metadata } from "next";
import { Cinzel, Outfit, Noto_Sans_Tamil } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

/** Clean geometric body face — reads well on dark UI */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

/** Elegant display face — navy and blue studio feel */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
});

export const metadata: Metadata = {
  title: `${BRAND.nameLatin} | ${BRAND.fullName}`,
  description: `${BRAND.fullName} (${BRAND.nameLatin}) — student game development club at VIT Chennai. New games coming soon.`,
  icons: {
    icon: BRAND.logoSrc,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`${outfit.variable} ${cinzel.variable} ${notoTamil.variable} ${outfit.className} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
