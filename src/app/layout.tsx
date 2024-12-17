import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProviders from "@/provider/clientProviders";
import AuthGuard from "@/config/authguard";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LexTech AI",
  description: "An AI Assistant dedicated to case management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ClientProviders>
          <AuthGuard>
            <main>{children}</main>
          </AuthGuard>
        </ClientProviders>

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
