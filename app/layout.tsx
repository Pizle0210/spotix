import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "../components/convex-client-provider";
import Header from "../components/shared/header";
import Footer from "../components/shared/footer";
import SyncUserWithConvex from "../components/sync-user-with-convex";
import { Toaster } from "../components/ui/sonner";
import Background from "../components/background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotix",
  description: "Buy and Sell event tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} relative min-h-screen ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ClerkProvider dynamic>
            <Header />
            <SyncUserWithConvex />
            {children}
            <Toaster />
            <Footer />
          </ClerkProvider>
        </ConvexClientProvider>
        <Background />
      </body>
    </html>
  );
}
