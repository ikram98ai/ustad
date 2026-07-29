import { Skeleton } from "@/app/components";
import { Card, Flex, Box } from "@radix-ui/themes";

const LoadingChatPage = () => {
  return (
    <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
      <Card>
        <Flex align="center" gap="3">
          <Skeleton circle width="2.5rem" height="2.5rem" />
          <Box className="flex-1">
            <Skeleton width="10rem" />
          </Box>
        </Flex>
      </Card>
      <Skeleton height="60vh" />
    </Flex>
  );
};

export default LoadingChatPage;
