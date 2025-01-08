'use client'

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/store/contexts/AuthContext";
import AuthGuard from "@/components/auth/auth-guard";
import { Providers } from "@/components/providers";

export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Providers>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </Providers>
    </ThemeProvider>
  )
} 