import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/i18n/languageContext";
import { GoogleTranslateScript } from "@/components/layout/GoogleTranslateScript";

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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 lg:pb-0 font-sans antialiased"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <GoogleTranslateScript />
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
