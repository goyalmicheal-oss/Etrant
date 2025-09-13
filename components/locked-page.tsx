import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function LockedPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="text-center flex flex-col justify-center items-center gap-4 max-w-2xl mx-auto">
        <div className="bg-indigo-600 p-4 rounded-full">
          <LockIcon className="md:w-28 w-20 h-20 md:h-28 text-white" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-950 dark:text-white mb-4">
          Subscribe to Unlock this feature
        </h1>

        <Link href="/subscription">
          <Button
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-800"
          >
            Subscribe
          </Button>
        </Link>
      </div>
    </div>
  );
}
