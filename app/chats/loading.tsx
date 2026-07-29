import { Skeleton } from "@/app/components";
import { Card, Flex, Heading, Box } from "@radix-ui/themes";

const LoadingChatsPage = () => {
  const chats = [1, 2, 3, 4, 5];

  return (
    <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
      <Heading>Chats</Heading>
      {chats.map((chat) => (
        <Card key={chat}>
          <Flex align="center" gap="3">
            <Skeleton circle width="2.5rem" height="2.5rem" />
            <Box className="flex-1">
              <Skeleton width="10rem" />
              <Skeleton />
            </Box>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default LoadingChatsPage;
