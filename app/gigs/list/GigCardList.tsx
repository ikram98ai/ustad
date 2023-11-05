import { Avatar, Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { Gig } from "@prisma/client";

interface Props {
  gigs: Gig[];
}

const GigCardList = ({ gigs }: Props) => {
  return (
    <Grid columns={{ xs: "2", sm: "3", md: "4" }} gap="3">
      {gigs.map((gig) => (
        <Card key={gig.id}>
          <Flex gap="3" align="center">
            <Avatar
              size="3"
              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
              radius="full"
              fallback={gig.title[0]}
            />
            <Box>
              <Link href={`/gigs/${gig.id}`}>
                <Text as="div" size="2" weight="bold">
                  {gig.title}
                </Text>
              </Link>
              <Text as="div" size="1" color="gray">
                ${gig.rate} {gig.job_type}
              </Text>
            </Box>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};

export default GigCardList;
