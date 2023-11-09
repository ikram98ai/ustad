"use client";

import { Profession } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const GigProfessionFilter = ({
  professions,
}: {
  professions: Profession[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get("profession") || undefined}
      onValueChange={(profession) => {
        const params = new URLSearchParams();
        if (profession) params.append("profession", profession);
        if (searchParams.get("orderBy"))
          params.append("orderBy", searchParams.get("orderBy")!);

        const query = params.size ? "?" + params.toString() : "";
        router.push("/gigs/list" + query);
      }}
    >
      <Select.Trigger placeholder="Profession..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Profession</Select.Label>
          {professions?.map((profession) => (
            <Select.Item key={profession.id} value={profession.title}>
              {profession.title}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default GigProfessionFilter;
