import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", axes: ["opsz", "SOFT"] });

export const metadata: Metadata = {
  title: {
    default: "The African Child — Keep a child in secondary school",
    template: "%s · The African Child",
  },
  description:
    "Monthly givers keep Nigerian children in secondary school — and see every naira spent, every term's results, and the family they support.",
};

export const viewport: Viewport = {
  themeColor: "#0d3a32",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
