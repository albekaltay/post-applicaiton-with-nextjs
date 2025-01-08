import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import AuthGuard from "@/components/auth/auth-guard";
import { AuthProvider } from "@/store/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'Babonbo | Modern Blog Platform',
    template: '%s | Babonbo'
  },
  description: 'Babonbo - Share your thoughts, build community. Original content about technology, lifestyle, culture and more.',
  keywords: ['blog', 'social platform', 'content creation', 'community', 'article sharing', 'digital content'],
  authors: [{ name: 'Babonbo Team' }],
  creator: 'Babonbo',
  publisher: 'Babonbo',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://babonbo.com',
    siteName: 'Babonbo',
    title: 'Babonbo | Modern Blog Platform',
    description: 'Share your thoughts, build community. Explore technology, lifestyle, culture and more.',
    images: [
      {
        url: '/assets/images/babonbo-og.png',
        width: 1200,
        height: 630,
        alt: 'Babonbo Blog Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Babonbo | Modern Blog Platform',
    description: 'Share your thoughts, build community.',
    images: ['/assets/images/babonbo-twitter.png']
  },
  icons: {
    icon: '/assets/images/babonbo-mini-logo.png',
    shortcut: '/assets/images/babonbo-mini-logo.png',
    apple: '/assets/images/babonbo-mini-logo.png'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <AuthProvider>
              <AuthGuard>{children}</AuthGuard>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
