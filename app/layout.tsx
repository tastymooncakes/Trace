import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trace - Provenance for Digital Art",
  description: "Create digital art with verifiable blockchain provenance. Track iterations and prove authenticity with C2PA content credentials.",
  keywords: ["digital art", "provenance", "C2PA", "blockchain", "NFT", "content credentials"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Trace - Provenance for Digital Art",
    description: "Create digital art with verifiable blockchain provenance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}