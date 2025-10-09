import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/theme.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import SiteShell from "@/components/site/shell";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/Wishlist";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Attari Collection - Premium E-Commerce",
  description: "Discover premium fashion and lifestyle products at Attari Collection",
  keywords: "fashion, lifestyle, premium, e-commerce, clothing, accessories",
  authors: [{ name: "Attari Collection" }],
  openGraph: {
    title: "Attari Collection - Premium E-Commerce",
    description: "Discover premium fashion and lifestyle products",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attari Collection - Premium E-Commerce",
    description: "Discover premium fashion and lifestyle products",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="attari-theme">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SiteShell>
                  {children}
                </SiteShell>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
