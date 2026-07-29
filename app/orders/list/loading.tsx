import { Skeleton } from "@/app/components";
import PageContainer from "@/app/components/PageContainer";

const LoadingOrderPage = () => {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="mb-1">Orders</h1>
      <p className="mb-3 text-sm text-gray-500">
        Offers you’ve placed and work coming into your gigs.
      </p>
      <div className="mb-3 h-9 w-44 animate-pulse rounded-full bg-gray-100" />
      <div className="mb-3 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-gray-100"
          />
        ))}
      </div>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {[1, 2, 3, 4, 5].map((order) => (
          <div key={order} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton width="2.75rem" height="2.75rem" borderRadius="0.75rem" />
            <div className="flex-1">
              <Skeleton width="12rem" />
              <Skeleton width="55%" />
            </div>
            <div className="w-24">
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default LoadingOrderPage;
