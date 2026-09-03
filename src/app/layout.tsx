import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SchemeSetu: AI-Driven Scheme Matching for Marginalized Entrepreneurs",
  description:
    "Ministry of Social Justice and Empowerment (MoSJE) concessional credit matching and channel partner routing platform for SC beneficiaries.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-16 md:pb-0 font-sans antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
