import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card h-[400px] flex flex-col">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="flex-1 flex items-end justify-center space-x-4 px-4 pb-4">
              {/* Simulating bars */}
              <Skeleton className="w-1/4 h-3/4 rounded-t" />
              <Skeleton className="w-1/4 h-1/2 rounded-t" />
              <Skeleton className="w-1/4 h-2/3 rounded-t" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
