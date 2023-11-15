"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { patchOrderSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobType, Order } from "@prisma/client";
import {
  Button,
  Dialog,
  Flex,
  TextField,
  Select,
  Box,
  TextArea,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Pencil2Icon } from "@radix-ui/react-icons";

type OrderFormData = z.infer<typeof patchOrderSchema>;

const EditOrder = ({ order }: { order: Order }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(patchOrderSchema),
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const job_types = Object.values(JobType);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.patch(`/api/orders/${order.id}`, data);
      router.push("/orders/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      toast.error("An unexpected error occurred.");
    }
  });

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>
            <Pencil2Icon />
            Edit Order
          </Button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Order</Dialog.Title>
          <form className="space-y-3" onSubmit={onSubmit}>
            <Flex gap="3">
              <Box>
                <TextField.Root>
                  <TextField.Input
                    pattern="^\d*(\.\d{0,2})?$"
                    defaultValue={order.rate}
                    placeholder="Rate"
                    {...register("rate")}
                  />
                </TextField.Root>
                <ErrorMessage>{errors.rate?.message}</ErrorMessage>
              </Box>
              <Box>
                <Controller
                  name="job_type"
                  control={control}
                  defaultValue={order.job_type}
                  render={({ field }) => (
                    <Select.Root {...field} onValueChange={field.onChange}>
                      <Select.Trigger placeholder="Job Type..." />
                      <Select.Content>
                        <Select.Group>
                          <Select.Label>Job Type</Select.Label>
                          {job_types?.map((job_type) => (
                            <Select.Item key={job_type} value={job_type}>
                              {job_type}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                <ErrorMessage>{errors.job_type?.message}</ErrorMessage>
              </Box>
            </Flex>
            <TextArea
              placeholder="Requirements"
              defaultValue={order.requirements}
              {...register("requirements")}
            />
            <ErrorMessage>{errors.requirements?.message}</ErrorMessage>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {"Edit Order"} {isSubmitting && <Spinner />}
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
      <Toaster />
    </>
  );
};

export default EditOrder;
