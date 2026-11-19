import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import FloatingBall from "./components/FloatingBall";
import SwRegister from "./sw-register";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Cup 2026",
  description:
    "FIFA World Cup 2026 - all 48 qualified nations with flags, groups, a live knockout bracket, and an interactive world map and globe.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Foldable open screen (short side 600-767px, touch): flag set before paint and
            re-checked on resize so folding back to the front screen drops it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function d(){var e=document.documentElement,m=Math.min(screen.width,screen.height);if(navigator.maxTouchPoints>1&&m>=600&&m<768)e.dataset.device="duo";else delete e.dataset.device}d();addEventListener("resize",d)})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <FloatingBall />
        <SwRegister />
      </body>
    </html>
  );
}
