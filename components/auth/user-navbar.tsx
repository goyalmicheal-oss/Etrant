"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/etrant.png";

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-gray-800"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 bottom-0 right-0 h-full w-80 bg-red-900 border-l border-gray-800 z-[999] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Image src={Logo} alt="Etrant's Logo" className="h-full w-full" />
            </div>
            <span className="text-xl font-black text-white">Etrant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col p-6 space-y-4">
          <Link href="/how-it-works" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
            >
              How It Works
            </Button>
          </Link>
          <Link href="/pricing" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
            >
              Pricing
            </Button>
          </Link>
          <Link href="/automation" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
            >
              Automation
            </Button>
          </Link>
          <Link href="/file-analyzer" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
            >
              File Analyzer
            </Button>
          </Link>
          <Link href="/profile" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
            >
              Profile
            </Button>
          </Link>

          {/* Mobile Sign Up Button */}
          <div className="pt-4 border-t border-gray-800">
            <Link href="/auth" onClick={closeMobileMenu}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg font-medium shadow-md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 Wiki Reel</p>
            <p className="mt-1">Transform your learning experience</p>
          </div>
        </div>
      </div>
    </>
  );
}
