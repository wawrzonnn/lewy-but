import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Kalkulator Emerytalny ZUS",
  description: "Sprawdź informacje o swojej przyszłej emeryturze",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="fixed top-0 left-0 z-50 p-4">
          <img
            src="/logozus.svg"
            alt="Logo ZUS"
            className="h-12 w-auto"
          />
        </header>
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
