import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expedited Transport Services | Trucking & Logistics in CT",
  description: "New Haven trucking company specializing in hotshot trucking, LTL, dry van, expedited shipping, and warehousing. Serving West Hartford, New Haven, Stamford and surrounding areas. Call (860) 988-3887.",
  keywords: "trucking services, hotshot trucking, LTL trucking, dry van, expedited trucking, freight shipping, logistics, West Hartford CT, New Haven CT",
  openGraph: {
    title: "Expedited Transport Services | CT Trucking Company",
    description: "Professional trucking and logistics solutions in Connecticut. Hotshot, LTL, dry van, expedited shipping & warehousing. Founded 2014.",
    type: "website",
    url: "https://expeditedtransportservices.net/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
