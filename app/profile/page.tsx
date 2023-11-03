import { Button } from "@radix-ui/themes";
import Link from "next/link";

const ProfilePage = () => {
  // const user = "ikram";

  // return user ? <LoginPage /> : <div>Profile Page</div>;
  return (
    <>
      <Button>
        <Link href="/gigs/new">Create Gig</Link>
      </Button>
    </>
  );
};

export default ProfilePage;
