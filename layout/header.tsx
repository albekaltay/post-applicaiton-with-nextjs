"use client";
// next
import Link from "next/link";
//
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// icon
import { User } from "lucide-react";

import { useAuth } from "@/store/contexts/AuthContext";
 

// ----------------------------------------------------------------------

export default function Header() {
  const { accessToken, user } = useAuth();

  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 transition-all bg-white dark:bg-gray-900  h-24 flex items-center w-full border-b-4 border-rose-600 dark:border-rose-600">
      <nav className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={"/"} className="flex flex-row items-center gap-2 w-full">
            <span className="text-2xl font-bold text-primary sm:block">
              Posts Application
            </span>
          </Link>
        </div>
        <div>
          {accessToken ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="overflow-hidden rounded-lg h-[35px] w-[35px] bg-rose-600 hover:bg-rose-500 text-white border-none"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/auth/login"}>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-rose-600">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-rose-500 hover:bg-white hover:text-rose-600 text-white">
                  Create a Free Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
