import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-md:pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-500 dark:border-gray-700 pb-4">
          <Skeleton className="h-8 md:h-10 w-3/4 mb-4" />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 md:mb-8">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        <div className="mb-8 pb-8 border-b border-gray-500 dark:border-gray-700 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Questions Section */}
        <Skeleton className="h-7 w-48 mb-4" />
        
        <div className="space-y-4">
           {[1, 2, 3].map((i) => (
             <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
               <div className="flex gap-3 items-start mb-2">
                 <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                 <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
