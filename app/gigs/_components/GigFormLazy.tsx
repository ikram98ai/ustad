"use client";
import dynamic from "next/dynamic";
import GigFormSkeleton from "./GigFormSkeleton";

// SimpleMDE (inside GigForm) touches `document` at import time, so the form
// must load client-side only. `ssr: false` is only allowed in client
// components, hence this wrapper instead of dynamic() in the pages.
const GigFormLazy = dynamic(() => import("./GigForm"), {
  ssr: false,
  loading: () => <GigFormSkeleton />,
});

export default GigFormLazy;
