"use client";
// lib
import { cn } from "@/lib/utils";

//
import Header from "./header";
import Footer from "./footer";

// ----------------------------------------------------------------------

export default function DashboardLayout({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const layoutClass = cn("flex min-h-screen flex-col", className);
  return (
    <div className={layoutClass} {...rest}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
