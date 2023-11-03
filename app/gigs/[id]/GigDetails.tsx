import { Gig } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const GigDetails = ({ gig }: { gig: Gig }) => {
  return (
    <>
      <Heading>{gig.title}</Heading>
      <Flex className="space-x-3" my="2">
        <Text>{gig.created_at.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full" mt="4">
        <ReactMarkdown>{gig.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default GigDetails;
