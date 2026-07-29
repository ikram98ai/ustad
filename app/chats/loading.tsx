import { Skeleton } from "@/app/components";

const LoadingChatsPage = () => {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-1">Chats</h1>
      <p className="mb-4 text-sm text-gray-500">
        <Skeleton width="8rem" />
      </p>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {[1, 2, 3, 4, 5].map((chat) => (
          <div key={chat} className="flex items-center gap-3.5 px-4 py-3.5">
            <Skeleton circle width="2.75rem" height="2.75rem" />
            <div className="flex-1">
              <Skeleton width="10rem" />
              <Skeleton width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingChatsPage;
