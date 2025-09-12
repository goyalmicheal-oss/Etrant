"use client";
import { Menu, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import { Button } from "./ui/button";
import { useState } from "react";
import { sidebarLinks } from "@/data/data";

export default function Header() {
  const { user } = useUserStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed w-full top-0 z-50 backdrop-blur-sm border-b border-gray-300/50 dark:border-gray-900">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <h1 className="md:text-lg font-semibold text-white">
            <Link href="/" className="flex items-center gap-2">
              <div className="md:w-9 md:h-9 w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src={Logo} className="w-full h-full" alt="Etrant Logo" />
              </div>
              <span className="md:text-2xl text-xl font-black text-gray-950 dark:text-white">
                Etrant
              </span>
            </Link>
          </h1>
          <div className="flex items-center space-x-4">
            {user?.points && (
              <div className="flex items-center space-x-2 bg-yellow-600 dark:bg-yellow-600/20 px-3 py-1 rounded-full">
                <Trophy className="md:w-4 md:h-4 w-3 h-3 text-yellow-200 dark:text-yellow-400" />
                <span className="md:text-sm text-xs font-medium text-yellow-200 dark:text-yellow-400">
                  {user?.points || 0}
                </span>
              </div>
            )}

            <div className="container mx-auto flex items-center justify-between">
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
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 bottom-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 z-[999] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
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
          {sidebarLinks.map((link) => (
            <Link href={link.link} onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
              >
                <link.icon />
                {link.name}
              </Button>
            </Link>
          ))}
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
        <div className="absolute bottom-16 left-0 right-0 p-6 border-t border-gray-800">
          <div className="text-center text-gray-400 text-xs">
            <p>© 2025 Etrant</p>
            <p className="mt-1">Transform your learning experience</p>
          </div>
        </div>
      </div>
    </>
  );
}
