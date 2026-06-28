import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { StoreProvider } from "@/components/store";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/Toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Oremar — Doğanın Kalbinden, Doğrudan Üreticiden",
  description:
    "Hakkâri, Yüksekova, Şırnak ve çevresinin doğal ürünleri; kimliği doğrulanmış üreticilerden, güvenli ödeme ve soğuk zincirle kapınıza.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
          <WhatsAppWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
