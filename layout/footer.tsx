import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import React from "react";
 

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="md:px-10 lg:px-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 pt-8 pb-10">
        <div className="flex flex-col md:flex-row items-center gap-8 ">
          <Image
            alt="Babonbo Logo"
            src="/assets/images/b-logo.png"
            height={40}
            width={40}
          />
          <div className="flex items-center text-xs gap-4 h-6 ">
            <span>Copyright © 2025 by Albek Altay</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
