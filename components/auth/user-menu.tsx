"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  LogOut,
  BookDown,
  AlarmClockCheck,
  DollarSign,
  Book,
  FormInput,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";

export function UserMenu() {
  const { data: session, status } = useSession();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  const aiQuestionHandler = () => {
    if (user?.interest) {
      router.push("/ai-questions");
    } else {
      router.push("/interest");
    }
  };

  if (status === "loading") {
    return <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />;
  }
  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {user?.subscriptionActive === true && (
              <p className="bg-yellow-700 text-[8px] px-1 py-0 rounded-full absolute z-30 top-0 -right-2">
                {user?.plan}
              </p>
            )}
            <Avatar
              className={`w-8 h-8 border-2 ${user?.subscriptionActive === true ? "border-yellow-600" : "border-transparent"}`}
            >
              <AvatarImage
                src={session?.user?.image || ""}
                alt={user?.name || ""}
                className={``}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-gray-800 border-gray-700 text-white"
          align="end"
          forceMount
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <Link
              href={"/"}
              className="flex flex-col space-y-1 leading-none cursor-pointer"
            >
              {session?.user?.name && (
                <p className="font-medium">{session?.user?.name}</p>
              )}
              {session?.user?.email && (
                <p className="w-[200px] truncate text-sm text-gray-400">
                  {session?.user?.email}
                </p>
              )}
            </Link>
          </div>
          <DropdownMenuSeparator className="bg-gray-700" />
          <div className="p-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Streak:</span>
              <span className="font-semibold text-orange-400">
                {user?.streak || 0}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Interest:</span>
              <span className="font-semibold text-orange-400">
                {!user
                  ? "none"
                  : user?.interest === null
                    ? "none"
                    : user?.interest?.toUpperCase()}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            onClick={aiQuestionHandler}
            className="hover:bg-gray-700 cursor-pointer"
          >
            <BookDown className=" h-4 w-4" />
            <span>AI Questions</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild className="hover:bg-gray-700">
            <Link href="/articles" className="flex items-center cursor-pointer">
              <AlarmClockCheck className="mr-2 h-4 w-4" />
              <span>Article Reel</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />

          <DropdownMenuItem asChild className="hover:bg-gray-700">
            <Link
              href="/daily-digest"
              className="flex items-center cursor-pointer"
            >
              <Book className="mr-2 h-4 w-4" />
              <span>Daily Digest</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild className="hover:bg-gray-700">
            <Link
              href="/leaderboard"
              className="flex items-center cursor-pointer"
            >
              <Trophy className="mr-2 h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild className="hover:bg-gray-700">
            <Link
              href="/subscription"
              className="cursor-pointer flex items-center"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />

          <DropdownMenuItem asChild className="hover:bg-gray-700">
            <Link
              href="/user-feedback"
              className="cursor-pointer flex items-center"
            >
              <FormInput className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={loading}
            className="hover:bg-gray-700 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
