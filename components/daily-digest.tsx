import { getDailyDigest } from "@/lib/db/get-daily-digest";
import { IDailyDigest } from "@/types";
import Link from "next/link";

export default async function DailyDigests() {
  const articles = (await getDailyDigest()) as IDailyDigest[];
  if (articles.length < 1) {
    return (
      <div className="h-full w-full mt-48 flex justify-center items-center">
        <p className="text-gray-400 text-2xl">No Latest News.</p>
      </div>
    );
  }
  console.log(articles);

  return (
    <>
      {articles?.map((article) => (
        <Link href={`/daily-digest/${article.id}`} key={article?.title}>
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-gray-500 duration-500">
            <div className="border-b border-gray-500">
              <h2 className="text-lg md:text-2xl">{article?.title}</h2>
              <div className="flex items-center flex-wrap gap-2 my-4">
                {article?.topic?.split(",")?.map((topic: any) => {
                  const colors = [
                    "bg-green-700",
                    "bg-orange-700",
                    "bg-indigo-700",
                    "bg-yellow-700",
                    "bg-blue-700",
                  ];
                  const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <span
                      key={topic}
                      className={`${randomColor} px-4 py-1 text-[10px] md:text-sm rounded-full`}
                    >
                      {topic}
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-gray-300">
              {article?.summary.slice(0, 300)}...
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
