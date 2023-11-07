import { Flex } from "@radix-ui/themes";
import React from "react";
import GigProfessionFilter from "./GigProfessionFilter";
import prisma from "@/prisma/client";

const GigActions = async () => {
  const professions = await prisma.profession.findMany();
  return (
    <Flex justify="between">
      <GigProfessionFilter professions={professions} />
    </Flex>
  );
};

export default GigActions;
