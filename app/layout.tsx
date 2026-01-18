import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Main Stream - Filmes e Séries",
  description: "Descubra os melhores filmes e séries em Main Stream. Assista trailers, veja avaliações e encontre seu próximo entretenimento favorito.",
  keywords: ["filmes", "séries", "streaming", "trailers", "netflix", "main stream"],
  authors: [{ name: "Main Stream" }],
  openGraph: {
    title: "Main Stream - Filmes e Séries",
    description: "Descubra os melhores filmes e séries em Main Stream.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Main Stream - Filmes e Séries",
    description: "Descubra os melhores filmes e séries em Main Stream.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-black text-white antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
