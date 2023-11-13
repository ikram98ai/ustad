import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditOrderButton = ({ orderId }: { orderId: number }) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/api/orders/edit/${orderId}`}>Edit Order</Link>
    </Button>
  );
};

export default EditOrderButton;
