"use client";
import { useEffect } from "react";
import { useAuth } from "@/store/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, refreshAccessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const tokenFromCookie = Cookies.get("accessToken");

  const isPublicRoute = (path: string) => {
    const privateRoutes = ["/create", "/edit"];

    if (privateRoutes.some((route) => path.includes(route))) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!tokenFromCookie && !isPublicRoute(pathname)) {
      router.push("/auth/login");
      return;
    }

    if (accessToken && pathname === "/auth/login") {
      router.push("/posts");
    }

    const checkToken = async () => {
      if (!tokenFromCookie) return;

      try {
        const decodedToken = jwtDecode(tokenFromCookie) as { exp: number };
        const expirationTime = decodedToken.exp * 1000;

        if (Date.now() >= expirationTime - 60000) {
          await refreshAccessToken();
        }
      } catch (error) {
        console.error("Token control error:", error);
        router.push("/");
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 30000);
    return () => clearInterval(interval);
  }, [accessToken, tokenFromCookie, refreshAccessToken, router, pathname]);

  return <>{children}</>;
}
