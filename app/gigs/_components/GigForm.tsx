"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { gigSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gig, JobType, Profession } from "@prisma/client";
import {
  Box,
  Button,
  Callout,
  Flex,
  Select,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type GigFormData = z.infer<typeof gigSchema>;

const GigForm = ({
  gig,
  professions,
}: {
  gig?: Gig;
  professions: Profession[];
}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const job_types = Object.values(JobType);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GigFormData>({
    resolver: zodResolver(gigSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (gig) await axios.patch("/api/gigs/" + gig.id, data);
      else await axios.post("/api/gigs", data);
      router.push("/");
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
            defaultValue={gig?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Flex gap='3'>
          <Box>
            <TextField.Root>
              <TextField.Input
                type="number"
                defaultValue={gig?.rate}
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
              defaultValue={gig?.job_type}
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

        <TextField.Root>
          <TextField.Input
            type="number"
            defaultValue={gig?.range}
            placeholder="Range"
            {...register("range")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.range?.message}</ErrorMessage>
        <Controller
          name="professionId"
          control={control}
          defaultValue={gig?.professionId.toString()}
          render={({ field }) => (
            <Select.Root {...field} onValueChange={field.onChange}>
              <Select.Trigger placeholder="Profession..." />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Profession</Select.Label>
                  {professions?.map((profession) => (
                    <Select.Item key={profession.id} value={profession.id}>
                      {profession.title}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.professionId?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={gig?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {gig ? "Update gig" : "Submit New gig"} {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default GigForm;
