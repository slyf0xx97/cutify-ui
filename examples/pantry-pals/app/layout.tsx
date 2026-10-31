import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Pixelify_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: "600", variable: "--font-pixel", display: "swap" });
const read = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-read", display: "swap" });

export const metadata: Metadata = {
  title: "Pantry Pals",
  description: "Two AI helpers plan your week from what's in your fridge. You approve the plan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${read.variable}`}>
      <body>{children}</body>
    </html>
  );
}
