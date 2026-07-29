"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { gigSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gig, JobType, Profession } from "@/prisma/models";
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
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";
import { LatLng } from "@/app/lib/geo";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-56 animate-pulse rounded-xl bg-gray-100" />
  ),
});

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
  const [coords, setCoords] = useState<LatLng | null>(
    gig?.latitude != null && gig?.longitude != null
      ? { lat: gig.latitude, lng: gig.longitude }
      : null
  );

  const job_types = Object.values(JobType);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GigFormData>({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      latitude: gig?.latitude ?? null,
      longitude: gig?.longitude ?? null,
    },
  });

  const onPickLocation = (loc: LatLng) => {
    setCoords(loc);
    setValue("latitude", loc.lat);
    setValue("longitude", loc.lng);
  };

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
        <TextField.Root
          defaultValue={gig?.title}
          placeholder="Title"
          {...register("title")}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Flex gap='3'>
          <Box>
            <TextField.Root
              type="number"
              defaultValue={gig?.rate}
              placeholder="Rate"
              {...register("rate")}
            />
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

        <TextField.Root
          type="number"
          defaultValue={gig?.range}
          placeholder="Range"
          {...register("range")}
        />
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

        <div>
          <p className="mb-1 text-sm font-semibold">Where do you work from?</p>
          <p className="mb-2 text-xs text-gray-500">
            Customers find you on the map by this pin. Drop it where you are
            based — your coverage range extends from here.
          </p>
          <LocationPicker value={coords} onChange={onPickLocation} />
        </div>
        <TextField.Root
          defaultValue={gig?.address ?? undefined}
          placeholder="Address / area shown to customers (optional)"
          {...register("address")}
        />
        <ErrorMessage>{errors.address?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          defaultValue={gig?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button highContrast disabled={isSubmitting}>
          {gig ? "Update gig" : "Submit New gig"} {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default GigForm;
