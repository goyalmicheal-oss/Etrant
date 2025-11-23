import DailyDigests from "@/components/daily-digest";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function DailyDigestPage() {
  return (
    <div className="p-6 max-md:pt-24 flex justify-center items-center flex-col">
      <div className="max-w-5xl flex flex-col justify-center gap-6">
        <div className="md:mb-2 flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-3xl dark:text-gray-100 text-gray-950 font-semibold">
            Daily Digest
          </h2>
        </div>
        <Suspense fallback={<CircleLoader />}>
          <DailyDigests />
        </Suspense>
      </div>
    </div>
  );
}
