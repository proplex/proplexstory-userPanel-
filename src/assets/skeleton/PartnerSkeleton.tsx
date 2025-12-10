const TopPartnersSkeleton = () => (
    <div className="w-full space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
  
  export default TopPartnersSkeleton