import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "GemCheck - Should You Grade It?",
  description: "Instant grading decisions powered by real eBay data, PSA pop reports, and gem rate analysis.",
  referrer: "no-referrer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={dmSans.variable + " " + jetbrainsMono.variable} style={{ fontFamily: "var(--font-dm-sans)", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
