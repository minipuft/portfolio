import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorProvider } from "@/contexts/ColorContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/effects/SmoothScroll";
import ThemeController from "@/components/effects/ThemeController";
import TextureOverlay from "@/components/layout/TextureOverlay";
import ContextualSidebar from "@/components/layout/ContextualSidebar";
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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--tn-bg-light)] text-[var(--tn-fg)] min-h-screen flex flex-col`}
      >
        <ColorProvider>
          <ModalProvider>
            <SidebarProvider>
              <TextureOverlay />
              <SmoothScroll />
              <ThemeController />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ContextualSidebar />
              {modal}
            </SidebarProvider>
          </ModalProvider>
        </ColorProvider>
      </body>
    </html>
  );
}
