import { Skeleton } from "../ui/skeleton";

export   const LoadingSkeleton = () => (
    <div className="w-full min-h-screen animate-pulse">
      <main className="max-w-6xl flex flex-col items-stretch mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Project Card skeleton */}
        <div className="w-full h-[400px] rounded-lg bg-gray-200 mb-8" />

        <div className="w-full flex lg:items-start lg:justify-between gap-5 lg:mt-8 mt-0 flex-col lg:flex-row mx-auto">
          <div className="lg:w-[700px]">
            {/* Tabs skeleton */}
            <div className="flex space-x-4 mb-6 border-b">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Investment Overview skeleton */}
          <div className="lg:w-[500px] space-y-4">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );