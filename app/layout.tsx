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
    default: 'Post App | Modern Blog Platform',
    template: '%s | Post App'
  },
  description: 'Post App - Share your thoughts, build community. Original content about technology, lifestyle, culture and more.',
  keywords: ['blog', 'social platform', 'content creation', 'community', 'article sharing', 'digital content'],
  authors: [{ name: 'Post App Team' }],
  creator: 'Post App',
  publisher: 'Post App',
  robots: {
    index: true,
    follow: true
  },
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
