import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { StoreProvider } from "@/components/store";
import { CatalogProvider } from "@/components/CatalogProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/Toaster";
import { fetchCatalogData } from "@/lib/queries";
import { getAuthSnapshot } from "@/lib/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [catalog, auth] = await Promise.all([
    fetchCatalogData(),
    getAuthSnapshot(),
  ]);
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <CatalogProvider data={catalog}>
          <AuthProvider initial={auth}>
            <StoreProvider>
              <SiteChrome>{children}</SiteChrome>
              <Toaster />
            </StoreProvider>
          </AuthProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
