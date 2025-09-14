import { create } from "zustand";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  streak: number | null;
  interest: string | null;
  points: number | null;
  lastActiveDate: string | null;
  language: string | null;
  rank?: string | null;
  plan: string | null;
  subscriptionActive: boolean | null;
  subscriptionEnd: string | null;
  stats: {
    totalReels: number | null;
    totalQuizzes: number | null;
    averageScore: number | null;
    studyTime: number | null;
    globalRank: number | null;
  };
  dailyPoints?: {
    id: number;
    userId: string;
    day: string | null;
    date: string | null;
    points: number | null;
  }[];
  weeklyActivity?: {
    id: number;
    userId: string;
    week: string | null;
    reels: number | null;
    quizzes: number | null;
    hours: number | null;
  }[];
  badges?: {
    id: number | null;
    name: string | null;
    description: string | null;
    icon: string | null;
    rarity: string | null;
    dateUnlocked: string;
  }[];
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateStats: (isCorrect: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  setUser: (user: User) => set({ user }),

  clearUser: () => set({ user: null }),

  updateStats: async (isCorrect: boolean) => {
    const currentUser = get().user;
    if (!currentUser) return;
    console.log("current user", currentUser);
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const week = `W${getWeekNumber(now)}`;

    // ---- Update Stats ----
    const newTotalQuizzes = currentUser?.stats?.totalQuizzes! + 1;
    const newAverageScore =
      (currentUser?.stats?.averageScore! * currentUser?.stats?.totalQuizzes! +
        (isCorrect ? 100 : 0)) /
      newTotalQuizzes;

    const newPoints = currentUser?.points! + (isCorrect ? 10 : 2); // Example scoring system
    const update = updateStreak(currentUser);

    // ---- Update Daily Points ----
    // let dailyPoints = [...currentUser.dailyPoints];

    //TODO: fix date expression
    // const todayEntry = dailyPoints?.find((d) => d?.date?.toString() === today);
    //
    // if (todayEntry && todayEntry.points) {
    //   todayEntry.points += isCorrect ? 10 : 2;
    // } else {
    //   dailyPoints.push({
    //     id: Math.floor(Math.random() * 100000),
    //     userId: currentUser.id,
    //     day: now.toLocaleDateString("en-US", { weekday: "long" }),
    //     date: now.toString(),
    //     points: isCorrect ? 10 : 2,
    //   });
    // }

    // ---- Update Weekly Activity ----
    // let weeklyActivity = [...currentUser.weeklyActivity];
    // const currentWeek = weeklyActivity.find((w) => w.week === week);
    // if (currentWeek && currentWeek.quizzes && currentWeek.hours) {
    //   currentWeek.quizzes += 1;
    //   currentWeek.hours += 0.01; // Example: 0.6 mins per quiz
    // } else {
    //   weeklyActivity.push({
    //     id: Math.floor(Math.random() * 100000),
    //     userId: currentUser.id,
    //     week,
    //     reels: 0,
    //     quizzes: 1,
    //     hours: 0.1,
    //   });
    // }

    // ---- Update Badges ----
    // let badges = [...currentUser.badges];
    // if (newTotalQuizzes === 10 && !badges.find((b) => b.id === 1)) {
    //   badges.push({
    //     id: 1,
    //     name: "Quiz Beginner",
    //     description: "Completed 10 quizzes",
    //     icon: "🎯",
    //     rarity: "Common",
    //     dateUnlocked: now.toString(),
    //   });
    // }
    // if (update.streak === 7 && !badges.find((b) => b.id === 2)) {
    //   badges.push({
    //     id: 2,
    //     name: "7-Day Streak",
    //     description: "Answered quizzes 7 days in a row",
    //     icon: "🔥",
    //     rarity: "Rare",
    //     dateUnlocked: now.toString(),
    //   });
    // }
    const updatedUser: User = {
      ...currentUser,
      points: newPoints,
      streak: update.streak,
      lastActiveDate: update.lastActiveDate,
      stats: {
        ...currentUser.stats,
        totalQuizzes: newTotalQuizzes,
        averageScore: newAverageScore,
      },
      // dailyPoints,
      // weeklyActivity,
      // badges,
    };
    console.log("updated zustand user", updatedUser);
    set({ user: updatedUser });
    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify(updatedUser),
      headers: { "Content-Type": "application/json" },
    });
  },
}));

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
}

export const updateStreak = (user: User): User => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const today = formatDate(new Date());
  const lastActive = user.lastActiveDate ?? null;

  // If no lastActiveDate (new user) → first activity today
  if (!lastActive) {
    return {
      ...user,
      streak: 1,
      lastActiveDate: today,
    };
  }

  // If user already active today → do nothing
  if (lastActive === today) return user;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let newStreak = 1;
  if (lastActive === yesterdayStr) {
    newStreak = user.streak! + 1;
  }

  return {
    ...user,
    streak: newStreak,
    lastActiveDate: today,
  };
};
