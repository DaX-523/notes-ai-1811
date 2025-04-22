import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onSignOut: () => void;
}

const Header = ({ onSignOut }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>{" "}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-foreground hover:text-primary hover:bg-secondary"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
