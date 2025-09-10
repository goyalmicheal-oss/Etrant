"use client";
import { Trophy } from "lucide-react";
import { UserMenu } from "./auth/user-menu";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import Logo from "@/public/etrant.png";

export default function Header() {
  const { user } = useUserStore();
  return (
    <div className="md:hidden sticky top-0 z-50 backdrop-blur-sm border-b border-gray-300/50 dark:border-gray-900">
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
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
