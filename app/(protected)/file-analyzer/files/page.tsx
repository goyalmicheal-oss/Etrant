import { auth } from "@/auth";
import McqQuestion from "@/components/file-analyzer/mcq-question";
import { McqCard } from "@/components/question-card";
import Link from "next/link";

export default async function AnalyzerFilePage({
  searchParams,
}: {
  searchParams: Promise<{ fileId: string }>;
}) {
  const session = await auth();
  const { fileId } = await searchParams;
  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/api/file-analyzer/files`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user?.id! }),
    },
  );
  const files = await res.json();
  if (fileId) {
    const mcq_response = await fetch(
      `${process.env.NEXT_BASE_URL}/api/file-analyzer/mcqs/${fileId}`,
    );
    const questions = await mcq_response.json();
    return (
      <div className="text-white">
        {/* {questions.map((question, index) => ( */}
        {/* <McqQuestion key={question.id} currentQuestion={question} /> */}
        {/* ))} */}
      </div>
    );
  }
  return (
    <section className="text-white">
      <div className="flex flex-col items-center gap-6">
        {files.map((file: any) => (
          <Link
            href={`?fileId=${file.id}`}
            key={file.id}
            className="p-4 dark:text-gray-100 text-gray-950 rounded-xl border border-gray-300 dark:border-gray-700"
          >
            {file.fileName}
          </Link>
        ))}
      </div>
    </section>
  );
}
