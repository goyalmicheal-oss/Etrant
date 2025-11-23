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
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Files Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              You haven't uploaded any files for analysis yet. Upload a PDF to generate MCQs and start practicing!
            </p>
            <Link
              href="/file-analyzer"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Upload Your First File
            </Link>
          </div>
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
