"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { orderSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobType, Order } from "@prisma/client";
import {
  Box,
  Button,
  Callout,
  Dialog,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

type OrderFormData = z.infer<typeof orderSchema>;

const OrderForm = ({ order }: { order?: Order }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const job_types = Object.values(JobType);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (order) await axios.patch("/api/orders/" + order.id, data);
      else toast.error("An unexpected error occurred.");
      router.push("/orders/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      toast.error("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
      <form className="space-y-3" onSubmit={onSubmit}>
        <Flex gap="3">
          <Box>
            <TextField.Root>
              <TextField.Input
                pattern="^\d*(\.\d{0,2})?$"
                defaultValue={order?.rate}
                placeholder="Rate"
                {...register("rate")}
              />
            </TextField.Root>
            <ErrorMessage>{errors.rate?.message}</ErrorMessage>
          </Box>
          <Box>
            <Controller
              name="job_type"
              defaultValue={order?.job_type}
              control={control}
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
          defaultValue={order?.requirements}
          placeholder="Requirements"
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
            {"Request Order"} {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
      <Toaster />
    </div>
  );
};

export default OrderForm;
