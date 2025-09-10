import {
  AlarmClockCheck,
  BadgeDollarSign,
  Book,
  BookDown,
  BookOpen,
  Brain,
  Crown,
  File,
  FormInput,
  Smartphone,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

export interface IPlan {
  name: string;
  price: number;
  icon: any;
  description: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  buttonVariant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  popular: boolean;
}
export const plans: IPlan[] = [
  {
    name: "Free",
    price: 0,
    icon: Star,
    description: "Perfect for getting started with Etrant",
    features: [
      "100 reels per month",
      "No quizzes",
      "Limited current affairs",
      "Basic progress tracking",
      "Community access",
    ],
    limitations: [
      "Limited daily content",
      "Basic features only",
      "No offline access",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 99,
    icon: Zap,
    description: "Best for serious learners and exam preparation",
    features: [
      "2000 reels per month",
      "Advanced AI quizzes",
      "Full current affairs access",
      "Detailed analytics",
      "Priority support",
      "Custom study plans",
      "Progress insights",
    ],
    limitations: [],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Max",
    price: 149,
    icon: Crown,
    description: "Ultimate learning experience with premium features",
    features: [
      "Unlimited Reels",
      "Everything in Pro",
      "Exclusive premium content",
      "Advanced knowledge maps",
      "Custom exam simulations",
      "Priority content requests",
      "Early access to new features",
    ],
    limitations: [],
    buttonText: "Go Max",
    buttonVariant: "default" as const,
    popular: false,
  },
];

export const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans come with a 7-day free trial. You can cancel anytime during the trial period without being charged.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel anytime. You'll continue to have access to your paid features until the end of your current billing period.",
  },
];

export const stepsHowItWorks = [
  {
    step: "01",
    title: " Sign Up",
    description:
      "Get started in under 30 seconds with your Google account. No complex forms or credit cards required.",
    icon: Smartphone,
    color: "from-blue-500 to-indigo-500",
    features: [
      "One-click Google sign-in",
      "Instant profile setup",
      "Cross-device sync",
    ],
  },
  {
    step: "02",
    title: "Choose Your Path",
    description:
      "Select your interest (JEE, NEET, UPSC) or explore general knowledge. Our AI personalizes content just for you.",
    icon: Target,
    color: "from-purple-500 to-violet-500",
    features: [
      "Personalized content",
      "Exam-specific modules",
      "AI-powered recommendations",
    ],
  },
  {
    step: "03",
    title: "Swipe Through Reels",
    description:
      "Learn like you scroll Instagram! Bite-sized knowledge reels make complex topics digestible and fun.",
    icon: BookOpen,
    color: "from-emerald-500 to-green-500",
    features: [
      "Instagram-style UI",
      "Bite-sized content",
      "Visual learning aids",
    ],
  },
  {
    step: "04",
    title: "Test Your Knowledge",
    description:
      "Take instant quizzes after each reel. Get immediate feedback and track your understanding in real-time.",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    features: ["Instant quizzes", "Real-time feedback", "Progress tracking"],
  },
  {
    step: "05",
    title: "Earn & Compete",
    description:
      "Gain points, maintain streaks, and climb leaderboards. Learning becomes as addictive as gaming!",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    features: ["Points & XP system", "Streak rewards", "Global leaderboards"],
  },
];

export const sidebarLinks = [
  {
    name: "AI Questions",
    icon: BookDown,
    link: "/ai-questions",
  },
  {
    name: "Article Reel",
    icon: AlarmClockCheck,
    link: "/articles",
  },
  {
    name: "Daily Digest",
    icon: Book,
    link: "/daily-digest",
  },
  {
    name: "File Analzyer",
    icon: File,
    link: "/file-analyzer",
  },
  {
    name: "Subscription",
    icon: BadgeDollarSign,
    link: "/subscription",
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    link: "/leaderboard",
  },
  {
    name: "Feedback",
    icon: FormInput,
    link: "/user-feedback",
  },
];
