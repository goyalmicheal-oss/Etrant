import { auth } from "@/auth";
import FileMCQ from "@/components/file-analyzer/file-mcq";
import Link from "next/link";
import { db } from "@/lib/db/db";
import { files, mcqs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { QuestionData } from "@/types";

export default async function AnalyzerFilePage({
  searchParams,
}: {
  searchParams: Promise<{ fileId: string }>;
}) {
  const session = await auth();
  const { fileId } = await searchParams;

  if (!session?.user?.id) {
    return (
      <section className="text-white max-w-5xl py-24 space-y-6 w-full">
        <h2 className="text-2xl dark:text-gray-100 text-gray-950">
          Please sign in to view your files
        </h2>
      </section>
    );
  }

  const userFiles = await db
    .select()
    .from(files)
    .where(eq(files.userId, session.user.id));

  if (fileId && userFiles.length > 0) {
    const selectedFile = userFiles.find((fl) => fl.id === fileId);

    if (!selectedFile) {
      return (
        <section className="text-white max-w-5xl py-24 space-y-6 w-full">
          <h2 className="text-2xl dark:text-gray-100 text-gray-950">
            File not found
          </h2>
        </section>
      );
    }

    const file_name = selectedFile.fileName.split(".")[0];

    // Fetch MCQs directly from database
    const questions = (await db
      .select()
      .from(mcqs)
      .where(eq(mcqs.fileId, fileId))) as QuestionData[];

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
        {userFiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No files uploaded yet
          </p>
        ) : (
          userFiles.map((file) => (
            <Link
              href={`?fileId=${file.id}`}
              key={file.id}
              className="p-4 dark:text-gray-100 hover:bg-gray-800 duration-200 text-gray-950 w-full rounded-xl border border-gray-300 dark:border-gray-700"
            >
              {file.fileName.split(".")[0]}
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
