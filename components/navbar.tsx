"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/store/hooks/useLogout";

export default function Navbar() {
  const logout = useLogout();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* ... diğer navbar içeriği ... */}
        
        <div className="ml-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
} 