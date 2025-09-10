import type { Metadata } from "next";
import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { articlesMeta } from "@/lib/config/site";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = articlesMeta;

export default async function ArticlePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <main className="min-h-screen dark:bg-black">
          <InfiniteReel />
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
