import { auth } from "@/auth";
import FileMCQ from "@/components/file-analyzer/file-mcq";
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
    const file_name = files
      .filter((fl: any) => fl.id === fileId)[0]
      .fileName.split(".")[0];
    console.log("filename", file_name);
    const mcq_response = await fetch(
      `${process.env.NEXT_BASE_URL}/api/file-analyzer/mcqs/${fileId}`,
    );
    const questions = await mcq_response.json();
    return (
      <>
        {questions.length > 0 && (
          <FileMCQ questions={questions} file={file_name} />
        )}
      </>
    );
  }
  return (
    <section className="text-white max-w-5xl py-24 space-y-6 w-full">
      <h2 className="text-2xl dark:text-gray-100 text-gray-950">
        Your File History
      </h2>
      <div className="flex flex-col items-center w-full gap-6">
        {files.map((file: any) => (
          <Link
            href={`?fileId=${file.id}`}
            key={file.id}
            className="p-4 dark:text-gray-100 hover:bg-gray-800 duration-200 text-gray-950 w-full rounded-xl border border-gray-300 dark:border-gray-700"
          >
            {file.fileName.split(".")[0]}
          </Link>
        ))}
      </div>
    </section>
  );
}
