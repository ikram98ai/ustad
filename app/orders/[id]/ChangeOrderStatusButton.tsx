"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "PENDING" | "CANCELLED" | "REJECTED" | "ACCEPTED" | "COMPLETED";

interface Props {
  orderId: string;
  status: Status;
  color: "orange" | "red" | "violet" | "green" | "blue";
}

const ACTION: Record<Status, { label: string; description: string }> = {
  ACCEPTED: {
    label: "Accept order",
    description:
      "The order moves to “In progress” and the customer is notified that you’re taking the job.",
  },
  REJECTED: {
    label: "Reject order",
    description:
      "The customer will be notified that you declined this request. This cannot be undone.",
  },
  CANCELLED: {
    label: "Cancel order",
    description:
      "The ustad will be notified that you withdrew this order. This cannot be undone.",
  },
  COMPLETED: {
    label: "Mark completed",
    description:
      "This closes the order as done for both sides. Do this once the work is finished and agreed.",
  },
  PENDING: {
    label: "Reopen order",
    description: "This puts the order back into the pending state.",
  },
};

const ChangeOrderStatusButton = ({ orderId, status, color }: Props) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isChangingStatus, setChangingStatus] = useState(false);
  const action = ACTION[status];

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
            {action.label}
            {isChangingStatus && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 440 }}>
          <AlertDialog.Title>{action.label}?</AlertDialog.Title>
          <AlertDialog.Description>
            {action.description}
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Go back
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color={color} onClick={changeOrderStatus}>
                {action.label}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Something went wrong</AlertDialog.Title>
          <AlertDialog.Description>
            The order could not be updated. Please try again.
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
