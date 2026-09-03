import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-16 md:pb-0 font-sans antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
