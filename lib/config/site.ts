export const siteConfig = {
  title: "Etrant | Learn fast with reels",
  name: "Etrant",
  description:
    "Etrant is an AI-powered learning platform that turns Wikipedia summaries, news, and exam-focused questions into scrollable reels. Learn faster and prepare smarter for UPSC, JEE, NEET, and more.",
  url: "https://etrant.akkhil.dev",
  ogImage:
    "https://raw.githubusercontent.com/akhil683/Portfolio_Blogs/refs/heads/main/images/og-image.png",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "Etrant",
    "Wikipedia Reels",
    "Exam Preparation",
    "UPSC Current Affairs",
    "JEE Preparation",
    "Interactive Learning",
    "AI Summarization",
    "Daily Quiz",
    "Microlearning",
    "Visual Learning",
    "Personalized Study",
    "General Knowledge",
    "EdTech",
    "Daily Digest",
    "AI-powered Learning",
    "Short Notes Generator",
    "Competitive Exams",
    "Study Reels",
    "Smart Learning",
  ],
  authors: [
    {
      name: "Akhil Palsra",
      url: "https://akkhil.dev",
    },
  ],
  creator: "Etrant Team",
  themeColor: "#6366f1",
};

export type SiteConfig = typeof siteConfig;

export const articlesMeta = {
  title: "AI-Summarized Wikipedia Articles",
  description:
    "Discover AI-summarized Wikipedia articles in interactive reel format. Learn faster with bite-sized explanations, visual stories, and smart knowledge reels tailored for curious learners.",
  icon: siteConfig.icons,
  keywords: [
    "Wikipedia Reels",
    "AI Summarized Articles",
    "Knowledge Reels",
    "Interactive Learning",
    "Microlearning",
    "AI-powered Summaries",
    "Visual Learning",
    "Daily Learning",
    "Educational Reels",
    "Smart Study",
    "Learn with AI",
    "Quick Knowledge",
  ],
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/articles`,
    title: "AI-Summarized Wikipedia Articles",
    description:
      "Bite-sized Wikipedia knowledge in AI-powered reel format. Learn quickly, stay curious.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "WikiReel Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Summarized Wikipedia Articles | Etrant",
    description:
      "Get Wikipedia knowledge in bite-sized AI-summarized reels. Learn faster with Etrant.",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};

export const aiquestionsMeta = {
  title: "AI-Powered Questions",
  description:
    "Practice AI-generated questions tailored to your interests. Improve learning with interactive question reels and personalized quizzes on Etrant.",
  keywords: [
    "AI questions",
    "personalized learning",
    "quiz reels",
    "exam preparation",
    "interactive learning",
    "Etrant AI",
  ],
  alternates: {
    canonical: `${siteConfig.url}/ai-questions`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/ai-questions`,
    title: "AI Questions | Etrant",
    description:
      "Discover personalized, AI-generated questions in reel format. Learn smarter, faster with Etrant’s AI-driven practice.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Etrant AI Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Questions | Etrant",
    description:
      "Boost your learning with personalized AI-generated questions in interactive reels.",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};

export const leaderboardMeta = {
  title: "Leaderboard",
  description:
    "Check out the Etrant leaderboard to see top performers, point rankings, and monthly champions. Join the challenge, earn points, and climb the ranks in our knowledge community.",
  keywords: [
    "Leaderboard",
    "Etrant Rankings",
    "Top Performers",
    "Monthly Champions",
    "Points Leaderboard",
    "Knowledge Competition",
    "Ranking System",
    "Community Achievements",
    "Gamified Learning",
    "Top Users",
    "Best Performers",
    "Etrant Points",
  ],
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/leaderboard`,
    title: "Leaderboard | Etrant",
    description:
      "Discover the top learners and monthly champions on Etrant. Earn points, compete, and rise in the knowledge leaderboard.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Etrant Leaderboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaderboard | Etrant",
    description:
      "See the top performers and knowledge champions on the Etrant leaderboard. Join the challenge!",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};

export const authMetadata = {
  title: "Sign In",
  description:
    "Sign in to Etrant with Google to explore AI-powered quizzes, reels, and leaderboards. Join the community and track your learning journey.",
  keywords: [
    "AI sign in",
    "Google login",
    "Etrant sign in",
    "AI learning platform",
    "quiz login",
    "AI knowledge reels",
    "AI leaderboard",
    "Google authentication",
    "AI education app",
    "Join Etrant",
  ],
  openGraph: {
    title: "Sign In | Etrant",
    description:
      "Sign in to Etrant using Google and unlock AI-powered quizzes, reels, and leaderboard rankings.",
    url: `${siteConfig.url}/auth`,
    siteName: "Etrant",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Sign in to Etrant with Google",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Etrant",
    description:
      "Join Etrant with Google sign-in to access AI-powered quizzes, reels, and leaderboard stats.",
    images: [siteConfig.ogImage],
  },
};

export const howItWorkMetadata = {
  title: "How Etrant Works | Learn Smarter with AI-Powered Reels",
  description:
    "Discover how Etrant makes learning fun and engaging in just 5 simple steps — from Google sign-in to personalized AI content, quizzes, and gamified rewards.",
  keywords: [
    "Etrant",
    "AI learning",
    "study reels",
    "interactive education",
    "gamified learning",
    "AI quizzes",
    "exam preparation",
    "JEE NEET UPSC learning",
    "visual learning",
    "knowledge reels",
    "AI education platform",
    "fun learning app",
  ],
  openGraph: {
    title: "How Etrant Works | 5 Steps to Smarter Learning",
    description:
      "See how Etrant revolutionizes learning with AI-powered reels, quizzes, and gamified rewards. Education that feels like social media.",
    url: `${siteConfig.url}/how-it-works`,
    siteName: "Etrant",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "How Etrant Works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Etrant Works | Learn Smarter with AI Reels",
    description:
      "Explore Etrant’s 5-step learning journey — AI-powered content, quizzes, and gamification.",
    images: [siteConfig.ogImage],
    creator: "@wikireel",
  },
  alternates: {
    canonical: `${siteConfig.url}/how-it-works`,
  },
};
