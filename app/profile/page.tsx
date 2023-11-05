import { Button,Flex } from "@radix-ui/themes";
import Link from "next/link";

const ProfilePage = () => {
  // const user = "ikram";

  // return user ? <LoginPage /> : <div>Profile Page</div>;
  return (
    <Flex direction='column' width='max-content' gap='3'>

      <Button>
        <Link href="/gigs/new">Create Gig</Link>
      </Button>
      <Button color="red">
        <Link href="/api/auth/signout">Log Out</Link>
      </Button>
    </Flex>
  );
};

export default ProfilePage;
