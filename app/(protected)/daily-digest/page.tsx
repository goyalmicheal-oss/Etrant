import DailyDigests from "@/components/daily-digest";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function DailyDigestPage() {
  return (
    <div className="p-6 max-md:pt-24 w-full flex items-center flex-col">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        <h2 className="text-xl md:text-3xl w-full dark:text-gray-100 text-gray-950 font-semibold">
          Daily Digest
        </h2>
        <Suspense fallback={<CircleLoader />}>
          <DailyDigests />
        </Suspense>
      </div>
    </div>
  );
}
