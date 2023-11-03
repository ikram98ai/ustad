import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditGigButton = ({ gigId }: { gigId: number }) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/gigs/edit/${gigId}`}>Edit Gig</Link>
    </Button>
  );
};

export default EditGigButton;
