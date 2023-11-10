"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { orderSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobType, Order } from "@prisma/client";
import { Button, Callout, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const job_types = Object.values(JobType);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (order) await axios.patch("/api/gigs/${id}/orders/" + order.id, data);
      else await axios.post("/api/gigs/${id}/orders/", data);
      router.push("/orders/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            pattern="^\d*(\.\d{0,2})?$"
            defaultValue={order?.rate}
            placeholder="Rate"
            {...register("rate")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.rate?.message}</ErrorMessage>
        <Controller
          name="job_type"
          control={control}
          defaultValue={order?.job_type}
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
        <Button disabled={isSubmitting}>
          {order ? "Update Order" : "Submit New Order"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;
