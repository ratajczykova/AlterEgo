import type { Metadata } from "next";
import { Bebas_Neue, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import AudioManager from "./components/AudioManager";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "ALTER EGO — Tunisia",
  description: "Gamified tourism web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased`}
      >
        <audio id="bg-music" loop>
          {/* Audio handled via AudioManager component logic */}
        </audio>
        <AudioManager />
        {children}
      </body>
    </html>
  );
}
