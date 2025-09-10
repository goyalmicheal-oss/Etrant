import type { Metadata } from "next";
import { getUserData } from "@/actions/getInterest";
import { QuestionReel } from "@/components/question-reel";
import { IUser } from "@/types";
import { aiquestionsMeta } from "@/lib/config/site";
import { redirect } from "next/navigation";
import LockedPage from "@/components/locked-page";
import { Suspense } from "react";
import CircleLoader from "@/components/loader/simple-loader-circle";

export const metadata: Metadata = aiquestionsMeta;

export default async function AiQuestionPage() {
  const userData: IUser | null = await getUserData();

  if (userData?.interest === "" || userData?.interest === null) {
    redirect("/interest");
  }

  if (userData?.subscriptionActive !== true) {
    return <LockedPage />;
  }

  return (
    <Suspense fallback={<CircleLoader />}>
      <QuestionReel interests={userData?.interest as string} />
    </Suspense>
  );
}
