import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorProvider } from "@/contexts/ColorContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  title: "Portfolio | Building Developer Tools for the AI Era",
  description: "Full-stack developer specializing in AI tooling, MCP servers, and modern web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--tn-bg-light)] text-[var(--tn-fg)] min-h-screen flex flex-col`}
      >
        <ColorProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ColorProvider>
      </body>
    </html>
  );
}
