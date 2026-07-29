const LoadingGigsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-11 flex-1 animate-pulse rounded-full bg-gray-100" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-gray-100"
          />
        ))}
      </div>
      <div className="lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-5">
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
        <div className="hidden h-[calc(100dvh-6.5rem)] animate-pulse rounded-2xl bg-gray-100 lg:block" />
      </div>
    </div>
  );
};

export default LoadingGigsPage;
