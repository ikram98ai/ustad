"use client";

import { Profession } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const professions: string[] = ["ALL PROFESSIONS", ...Object.values(Profession)];

const GigProfessionFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get("profession") || "ALL PROFESSIONS"}
      onValueChange={(profession) => {
        const params = new URLSearchParams();
        if (profession) params.append("profession", profession);
        if (searchParams.get("orderBy"))
          params.append("orderBy", searchParams.get("orderBy")!);

        const query = params.size ? "?" + params.toString() : "";
        router.push("/gigs/list" + query);
      }}
    >
      <Select.Trigger placeholder="Filter by profession..." />
      <Select.Content>
        {professions.map((profession) => (
          <Select.Item key={profession} value={profession || ""}>
            {profession}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default GigProfessionFilter;
