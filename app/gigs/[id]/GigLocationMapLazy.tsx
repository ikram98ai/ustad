"use client";

import dynamic from "next/dynamic";

const GigLocationMap = dynamic(() => import("./GigLocationMap"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />,
});

export default GigLocationMap;
