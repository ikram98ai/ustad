const LoadingProfilePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="h-20 animate-pulse bg-gray-200" />
        <div className="px-5 pb-5">
          <div className="-mt-9 h-20 w-20 animate-pulse rounded-full bg-gray-100 ring-4 ring-white" />
          <div className="mt-3 h-6 w-48 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
};

export default LoadingProfilePage;
