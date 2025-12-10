import { Skeleton } from "../ui/skeleton"

export const ProfileTabSkeleton = () => {
    return (
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full md:col-span-2" />
        </div>
        <div className="mt-12 mb-4 flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    )
  }
  
export const ProfileUpdateCardSkeleton = () => {
    return (
        <div className='flex justify-center items-center h-full'>
        <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-white rounded-lg">
          <Skeleton className="w-52 h-52 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-6" />
    </div>
  </div>
    )
}


export const HeaderSkeleton = () => (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-5 space-x-2">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>
    </header>
  );
  