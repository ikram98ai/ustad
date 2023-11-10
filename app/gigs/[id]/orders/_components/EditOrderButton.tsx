import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditOrderButton = ({ orderId }: { orderId: number }) => {
  const id = "1";
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/gigs/${id}orders/edit/${orderId}`}>Edit Order</Link>
    </Button>
  );
};

export default EditOrderButton;
