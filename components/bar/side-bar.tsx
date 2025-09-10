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

export default function Sidebar() {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const pathname = usePathname();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-md:hidden sticky top-0 h-screen lg:min-w-[15vw] py-12 px-4 bg-gray-950 border-r  z-50">
      <div className="h-full flex flex-col justify-between">
        <div>
          <h1 className="md:text-lg font-semibold text-white mb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="md:w-9 md:h-9 w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src={Logo} className="w-full h-full" alt="Etrant Logo" />
              </div>
              <span className="md:text-2xl text-xl font-black text-white">
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
                >
                  <div
                    className={`flex gap-4 p-3 rounded-lg items-center duration-200 
                      ${
                        isActive
                          ? "bg-indigo-600/50 text-white font-bold"
                          : "text-gray-200 hover:text-gray-100 hover:bg-gray-700"
                      }`}
                  >
                    <link.icon />
                    <span className="font-semibold">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center space-x-2 bg-yellow-600/20 px-3 py-2 rounded-full">
            <Trophy className="md:w-4 md:h-4 w-3 h-3 text-yellow-400" />
            <span className="md:text-sm text-xs font-medium text-yellow-400">
              {user?.points || 0}
            </span>
          </div>
          <Link href="/user/profile" className="cursor-pointer">
            <div className="flex gap-4 p-3 rounded-lg items-center duration-200 hover:bg-gray-700">
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
              <span className="font-semibold">Account</span>
            </div>
          </Link>
          <Button
            onClick={handleSignOut}
            className="flex bg-indigo-500 items-center gap-2 cursor-pointer text-gray-100 hover:bg-indigo-600 duration-200"
          >
            <LogOut />
            <span>{loading ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
