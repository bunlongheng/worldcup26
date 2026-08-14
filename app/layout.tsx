import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import FloatingBall from "./components/FloatingBall";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Cup 2026",
  description:
    "FIFA World Cup 2026 - all 48 qualified nations with flags, groups, a live knockout bracket, and an interactive world map and globe.",
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
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <FloatingBall />
      </body>
    </html>
  );
}
