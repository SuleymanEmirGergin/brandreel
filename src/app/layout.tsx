import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrandReel — 20 İçerik, 90 Saniyede",
  description:
    "Marka URL'ni yapıştır, 90 saniye bekle, 20 reel hazır. Wiro AI ile marka DNA'nızı okuyup fabrika gibi üretiyoruz.",
  keywords: ["brandreel", "social media", "content generation", "AI", "reel", "wiro ai"],
  openGraph: {
    title: "BrandReel — 20 İçerik, 90 Saniyede",
    description: "Marka URL'ni yapıştır, 90 saniye bekle, 20 reel hazır.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
