import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import GigStatusFilter from "./GigStatusFilter";

const GigActions = () => {
  return (
    <Flex justify="between">
      <GigStatusFilter />
      <Button>
        <Link href="/gigs/new">New gig</Link>
      </Button>
    </Flex>
  );
};

export default GigActions;
