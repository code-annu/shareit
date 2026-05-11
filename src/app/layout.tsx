import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareIt — Private Movie Sharing",
  description:
    "A private movie sharing platform. Upload, stream, and download movies securely.",
  keywords: ["movies", "streaming", "sharing", "private", "video"],
  robots: "noindex, nofollow", // Private app — no SEO indexing
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0a0a0a] font-sans text-white">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
