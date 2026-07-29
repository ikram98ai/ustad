import { Skeleton } from "@/app/components";
import PageContainer from "@/app/components/PageContainer";

const LoadingOrderDetailPage = () => {
  return (
    <PageContainer>
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <Skeleton width="6rem" />
          <Skeleton width="60%" height="1.75rem" />
          <div className="mt-5 border-t border-gray-100 pt-4">
            <Skeleton width="70%" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((tile) => (
            <div key={tile} className="rounded-xl bg-gray-50 p-3.5">
              <Skeleton width="5rem" />
              <Skeleton width="60%" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <Skeleton count={3} />
        </div>
      </div>
    </PageContainer>
  );
};

export default LoadingOrderDetailPage;
