import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceDev - Ultimate AI Agent Platform",
  description: "VoiceDev - The Ultimate AI Agent Platform with 250+ Tools, 123+ Skills, 17 Providers, 95+ Models. Built by an 11-year-old Egyptian developer.",
  keywords: ["AI", "Agent", "GPT", "Claude", "Gemini", "VoiceDev", "Next.js", "TypeScript", "Tauri", "TTS", "ASR"],
  authors: [{ name: "Mohabsmar" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VoiceDev - Ultimate AI Agent Platform",
    description: "250+ Tools, 123+ Skills, 17 Providers, Custom Endpoints. Built by an 11-year-old Egyptian developer.",
    url: "https://github.com/Mohabsmar/voicedev",
    siteName: "VoiceDev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceDev - Ultimate AI Agent Platform",
    description: "250+ Tools, 123+ Skills, 17 Providers. Built by an 11-year-old Egyptian developer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
