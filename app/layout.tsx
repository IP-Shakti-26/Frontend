import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "IP-SAKTI",
  description: "Ayurvedic Innovation & IP Navigator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} font-sans bg-offwhite antialiased relative`}
      >
        {/* Global Background Texture */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <Image 
            src="/images/bg.png" 
            alt="" 
            fill
            className="object-cover opacity-[0.08]"
            priority
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <header className="bg-forest text-offwhite py-4 px-6 shadow-md shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold tracking-tight">IP-SAKTI</h1>
            </div>
          </header>
          <main className="w-full flex-grow flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
