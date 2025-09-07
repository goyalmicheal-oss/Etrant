import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { notFound } from "next/navigation";
import getSingleDigest from "@/actions/get-single-digest";
import { IUser } from "@/types";
import { getUserData } from "@/actions/getInterest";
import LockedPage from "@/components/locked-page";

export default async function DailyDigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const digest = await getSingleDigest(id);
  if (!digest) {
    notFound();
  }

  const userData: IUser | null = await getUserData();

  if (userData?.subscriptionActive !== true) {
    return <LockedPage />;
  }
  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 border-b">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4 leading-tight">
            {digest?.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {digest?.topic?.split(",").map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 bg-indigo-700 border-indigo-500 hover:bg-indigo-800"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-lg mb-8 pb-8 border-b">
          {digest?.summary}
        </p>
        {/* Questions Section */}

        <h3 className="text-xl mb-2 md:text-2xl font-semibold">
          Relevant Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {digest?.relevantQuestions?.map((qa, index) => (
            <AccordionItem key={qa.question} value={qa.question}>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const digest = await getSingleDigest(id);
  if (!digest) {
    return {
      title: "Daily Digest Not Found",
      description: "The requested daily digest could not be found.",
    };
  }

  return {
    title: `${digest.title} | Daily Digest`,
    description: digest.summary.substring(0, 160) + "...",
    keywords: digest.topic,
    openGraph: {
      title: digest.title,
      description: digest.summary.substring(0, 160) + "...",
      type: "article",
      tags: digest.topic,
    },
  };
}

// Generate static params for known digest IDs
// export async function generateStaticParams() {
//   return Object.keys(digest).map((id) => ({
//     id: id,
//   }));
// }
