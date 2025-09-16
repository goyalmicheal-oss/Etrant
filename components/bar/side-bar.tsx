"use client";
import { LogOut, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { sidebarLinks } from "@/data/data";
import Logo from "@/public/etrant.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./theme-toggle";

export default function Sidebar() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-md:hidden sticky top-0 h-screen lg:min-w-[15vw] py-8 px-4 bg-gray-200 dark:bg-gray-950 border-r border-gray-300 dark:border-gray-800 z-50">
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col max-lg:justify-center max-lg:items-center">
          <h1 className="md:text-lg font-semibold text-white mb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="md:w-9 md:h-9 w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src={Logo} className="w-full h-full" alt="Etrant Logo" />
              </div>
              <span className="max-lg:hidden md:text-2xl text-xl font-bold text-gray-950 dark:text-white">
                Etrant
              </span>
            </Link>
          </h1>
          <div className=" flex flex-col gap-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname == link.link;
              return (
                <Link
                  key={link.link}
                  href={link.link}
                  className="cursor-pointer"
                  aria-label={link.name}
                  title={link.name}
                >
                  <div
                    className={`flex gap-3 p-3 text-sm rounded-lg max-lg:justify-center items-center duration-200 dark:text-gray-100 
                      ${isActive ? "bg-indigo-600 text-white" : " hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-950"}`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="max-lg:hidden">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            aria-label="Profile"
            href="/user/profile"
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
                    className={`w-8 h-8 border-2 ${user?.subscriptionActive === true ? "border-yellow-600" : "border-transparent"}`}
                  >
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                      width={100}
                      height={100}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600" />
              )}
              <p className="max-lg:hidden dark:font-semibold leading-4 dark:text-white flex flex-col text-gray-950">
                Account
                <span className="text-xs dark:text-gray-400 text-gray-700">
                  {user?.name}
                </span>
              </p>
            </div>
          </Link>
          <ThemeToggle />
          <div className="flex items-center justify-center space-x-2 dark:bg-yellow-600/20 bg-yellow-600 px-3 py-2 rounded-lg">
            <Trophy className="max-lg:hidden md:w-4 md:h-4 w-3 h-3 text-yellow-200 dark:text-yellow-400" />
            <span className="lg:text-sm text-xs font-medium text-yellow-200 dark:text-yellow-400">
              {user?.points || 0}
            </span>
          </div>
          <Button
            onClick={handleSignOut}
            className="flex bg-indigo-600 items-center gap-2 cursor-pointer text-gray-100 hover:bg-indigo-700 duration-200"
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut />
            <span className="max-lg:hidden">
              {loading ? "Signing out..." : "Sign Out"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
