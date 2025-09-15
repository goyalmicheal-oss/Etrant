"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  Target,
  Clock,
  Users,
} from "lucide-react";
import Image from "next/image";
import UserImage from "@/public/placeholder-user.jpg";
import Header from "@/components/header";
import { useUserStore } from "@/lib/store/useUserStore";
import { LanguageSelector } from "@/components/language-selector";
import { InterestSelector } from "@/components/selector/interest-selector";

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-white py-20 max-md:pt-24 px-4 w-full">
        <div className="container mx-auto max-w-7xl">
          <div className="md:space-y-12 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-800 rounded-xl md:p-8 p-4">
              <div className="flex items-center gap-6">
                <Image
                  src={user?.image || UserImage}
                  alt={user?.name || "User's Photo"}
                  width={100}
                  height={100}
                  className="md:w-20 md:h-20 w-12 h-12 rounded-full border-4 border-blue-500"
                />
                <div>
                  <h2 className="md:text-4xl text-2xl font-bold text-gray-950 dark:text-white mb-1">
                    {user?.name}
                  </h2>
                  <p></p>
                  <p className="max-md:text-xs text-gray-700 dark:text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex max-md:flex-col gap-4">
              <LanguageSelector />
              <InterestSelector />
            </div>
            {/* Enhanced Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 h-full  dark:hover:border-blue-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Total Points
                  </CardTitle>
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-gray-950 dark:text-white">
                    {user?.points}
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    +{user?.points} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 h-full hover:border-orange-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Current Streak
                  </CardTitle>
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-gray-950 dark:text-white">
                    {user?.streak} Days
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Learning for {user?.streak} Days
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 h-full hover:border-purple-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Subscription
                  </CardTitle>
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-950 dark:text-white">
                    {user?.plan || "Free"}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {user?.plan || "Free"} learner
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 h-full hover:border-green-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Avg. Score
                  </CardTitle>
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-gray-950 dark:text-white">
                    {user?.stats?.averageScore}%
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +3% this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 text-center p-6">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {user?.stats.totalReels}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  Reels Watched
                </div>
              </Card>

              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 text-center p-6">
                <Award className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {user?.interest}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  User Interest
                </div>
              </Card>

              <Card className="bg-gray-200 dark:bg-gray-900/50 border-gray-400 dark:border-gray-800 text-center p-6">
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {user?.stats?.studyTime}h
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  Total Study Time
                </div>
              </Card>
            </div>
            {/* Daily Points Chart */}
            {/* <Card className="bg-gray-900/50 border-gray-800"> */}
            {/*   <CardHeader> */}
            {/*     <CardTitle className="text-xl font-bold text-white flex items-center gap-2"> */}
            {/*       <TrendingUp className="h-5 w-5 text-blue-400" /> */}
            {/*       Daily Points (Last 7 Days) */}
            {/*     </CardTitle> */}
            {/*   </CardHeader> */}
            {/*   <CardContent> */}
            {/*     <div className="h-64 flex items-end justify-around gap-2 py-4"> */}
            {/*       {user?.dailyPoints?.map((data, index) => ( */}
            {/*         <div */}
            {/*           key={index} */}
            {/*           className="flex flex-col items-center h-full justify-end group" */}
            {/*         > */}
            {/*           <div className="relative"> */}
            {/*             <div */}
            {/*               className="md:w-10 w-8 rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-500 ease-out hover:from-blue-400 hover:to-purple-400 cursor-pointer" */}
            {/*               style={{ */}
            {/*                 height: `${(data?.points! / maxPoints) * 180}px`, */}
            {/*               }} */}
            {/*             ></div> */}
            {/*             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded md:opacity-0 group-hover:opacity-100 transition-opacity"> */}
            {/*               {data.points} */}
            {/*             </div> */}
            {/*           </div> */}
            {/*           <span className="text-xs text-gray-400 mt-3 font-medium"> */}
            {/*             {data.day} */}
            {/*           </span> */}
            {/*           <span className="max-md:hidden text-xs text-gray-500"> */}
            {/*             {data.date} */}
            {/*           </span> */}
            {/*         </div> */}
            {/*       ))} */}
            {/*     </div> */}
            {/*   </CardContent> */}
            {/* </Card> */}

            {/* Badges Section */}
            {/* <div> */}
            {/*   <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> */}
            {/*     Your Achievements */}
            {/*   </h2> */}
            {/*   <BadgeGallery /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
