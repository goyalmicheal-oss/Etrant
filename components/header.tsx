"use client";
import { Loader2, LogOut, Menu, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { sidebarLinks } from "@/data/data";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ThemeToggle from "./bar/theme-toggle";

export default function Header() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed w-full top-0 z-40 backdrop-blur-sm border-b border-gray-300/50 dark:border-gray-900">
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
                className="lg:hidden text-gray-950 dark:text-white dark:hover:bg-gray-800"
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
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[999] lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 bottom-0 right-0 h-full w-72 bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-800 z-[999] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 pb-4  border-b border-gray-300 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src={Logo} alt="Etrant's Logo" className="h-full w-full" />
            </div>
            <span className="text-xl font-black text-gray-950 dark:text-white">
              Etrant
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-950 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-800"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link key={link.link} href={link.link} onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-950 dark:text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium text-left"
              >
                <link.icon />
                {link.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-300 dark:border-gray-800">
          <div className="flex flex-col gap-2">
            <ThemeToggle />
            <Link
              href="/user/profile"
              onClick={closeMobileMenu}
              className="cursor-pointer"
            >
              <div className="flex gap-4 px-3 py-2 rounded-lg items-center duration-200 hover:bg-gray-300 dark:hover:bg-gray-700">
                {user?.image ? (
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    {user?.subscriptionActive === true && (
                      <p className="bg-yellow-700 text-[8px] px-1 py-0 rounded-full absolute z-30 top-0 -right-2">
                        {user?.plan}
                      </p>
                    )}
                    <Avatar
                      className={`min:w-8 h-8 border-2 ${user?.subscriptionActive === true ? "border-yellow-600" : "border-transparent"}`}
                    >
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                        width={100}
                        height={100}
                        className="w-8 h-8"
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600" />
                )}
                <p className="dark:font-semibold leading-4 dark:text-white flex flex-col text-gray-950">
                  Account
                  <span className="text-xs dark:text-gray-400 text-gray-700">
                    {user?.name}
                  </span>
                </p>
              </div>
            </Link>
            <Button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex bg-indigo-500 items-center gap-2 cursor-pointer text-gray-100 hover:bg-indigo-600 duration-200"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <LogOut />
                  <span>{loading ? "Signing out..." : "Sign Out"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
