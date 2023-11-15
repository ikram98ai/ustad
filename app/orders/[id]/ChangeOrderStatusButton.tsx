"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  orderId: string;
  status: "PENDING" | "CANCELLED" | "REJECTED" | "ACCEPTED" | "COMPLETED";
  color: "orange" | "red" | "violet" | "green";
}
const ChangeOrderStatusButton = ({ orderId, status, color }: Props) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isChangingStatus, setChangingStatus] = useState(false);

  const changeOrderStatus = async () => {
    try {
      setChangingStatus(true);
      await axios.patch("/api/orders/" + orderId, { status });
      router.push("/orders/list");
      router.refresh();
    } catch (error) {
      setChangingStatus(false);
      setError(true);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color={color} disabled={isChangingStatus}>
            {status.toLowerCase()} Order
            {isChangingStatus && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm {status.toLowerCase()}</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to {status.toLowerCase()} this Order? This
            action cannot be undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color={color} onClick={changeOrderStatus}>
                {status.toLowerCase()} Order
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This Order could not be {status.toLowerCase()}.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default ChangeOrderStatusButton;
