import { Skeleton } from "@/app/components";

const LoadingChatPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-3">
      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5">
        <Skeleton circle width="2.25rem" height="2.25rem" />
        <Skeleton circle width="2.5rem" height="2.5rem" />
        <div className="flex-1">
          <Skeleton width="10rem" />
          <Skeleton width="4rem" />
        </div>
      </div>
      <div className="min-h-0 flex-1 animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-11 flex-1 animate-pulse rounded-full bg-gray-100" />
        <div className="h-11 w-11 animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  );
};

export default LoadingChatPage;
