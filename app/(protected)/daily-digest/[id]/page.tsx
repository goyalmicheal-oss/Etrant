import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";

const digest = {
  id: "1",
  title: "Advanced React Patterns and Performance Optimization",
  author: "Sarah Chen",
  publishedDate: "2024-01-15",
  readTime: "8 min read",
  tags: ["React", "Performance", "JavaScript", "Frontend"],
  summary:
    "Explore cutting-edge React patterns including compound components, render props, and custom hooks that can dramatically improve your application's performance. This comprehensive guide covers advanced optimization techniques, memory management strategies, and best practices for building scalable React applications. Learn how to implement efficient state management, reduce unnecessary re-renders, and leverage React's concurrent features for better user experience.",
  questions: [
    {
      id: "q1",
      question:
        "What are compound components and how do they improve code reusability?",
      answer:
        "Compound components are a React pattern where multiple components work together to form a complete UI element. They provide flexibility by allowing users to compose components in different ways while maintaining a clean API. This pattern improves reusability by separating concerns and making components more modular and customizable.",
    },
    {
      id: "q2",
      question:
        "How can React.memo and useMemo help with performance optimization?",
      answer:
        "React.memo prevents unnecessary re-renders of functional components by memoizing the result based on props comparison. useMemo memoizes expensive calculations and only recalculates when dependencies change. Together, they help reduce computational overhead and improve application performance, especially in components with heavy rendering logic.",
    },
    {
      id: "q3",
      question: "What are the key benefits of using custom hooks?",
      answer:
        "Custom hooks allow you to extract component logic into reusable functions, promoting code reuse and separation of concerns. They help keep components clean and focused, make testing easier, and enable sharing stateful logic between components without prop drilling or complex state management patterns.",
    },
    {
      id: "q4",
      question:
        "How does React's concurrent rendering improve user experience?",
      answer:
        "Concurrent rendering allows React to interrupt and prioritize updates, keeping the UI responsive during heavy computations. It enables features like time slicing, where React can pause work to handle user interactions, and Suspense boundaries for better loading states, resulting in smoother and more responsive applications.",
    },
  ],
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function DailyDigestPage({ params }: PageProps) {
  // const digest = digestData[params.id as keyof typeof digestData];

  if (!digest) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 border-b">
          <h1 className="text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {digest.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {digest.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 bg-gray-700 border-gray-600"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-lg mb-8 pb-8 border-b">
          {digest.summary}
        </p>
        {/* Questions Section */}

        <h3 className="text-xl mb-2 md:text-2xl font-semibold">
          Relevant Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {digest.questions.map((qa, index) => (
            <AccordionItem key={qa.id} value={qa.id}>
              <AccordionTrigger className="text-left py-4">
                <span className="flex items-start gap-3">
                  <span className="bg-indigo-600 border border-indigo-400 text-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-300">
                    {qa.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 pl-9">
                <p className="text-gray-400 leading-relaxed">{qa.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  // const digest = digestData[params.id as keyof typeof digestData];

  if (!digest) {
    return {
      title: "Daily Digest Not Found",
      description: "The requested daily digest could not be found.",
    };
  }

  return {
    title: `${digest.title} | Daily Digest`,
    description: digest.summary.substring(0, 160) + "...",
    keywords: digest.tags.join(", "),
    authors: [{ name: digest.author }],
    openGraph: {
      title: digest.title,
      description: digest.summary.substring(0, 160) + "...",
      type: "article",
      publishedTime: digest.publishedDate,
      authors: [digest.author],
      tags: digest.tags,
    },
  };
}

// Generate static params for known digest IDs
// export async function generateStaticParams() {
//   return Object.keys(digest).map((id) => ({
//     id: id,
//   }));
// }
