import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "GemCheck — Pokemon Card Grading Data",
  description: "Real eBay sales data, PSA pop reports, and grading profit analysis for every Pokemon card.",
  referrer: "no-referrer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={inter.variable + " " + jetbrainsMono.variable} style={{ fontFamily: "var(--font-inter)", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
