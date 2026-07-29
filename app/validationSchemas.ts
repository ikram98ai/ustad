import { z } from "zod";

export const gigSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  rate: z.string().min(1, "Rate is required.").max(255),
  job_type: z.string().min(1, "Job type is required.").max(255),
  range: z.string().min(1, "Range is required.").max(255),
  professionId: z.string().min(1, "Profession id is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  address: z.string().max(255).optional(),
});
export const patchGigSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  rate: z.string().min(1, "Rate is required.").max(255).optional(),
  job_type: z.string().min(1, "Job type is required.").max(255).optional(),
  range: z.string().min(1, "Range is required.").max(255).optional(),
  professionId: z
    .string()
    .min(1, "Profession id is required.")
    .max(255)
    .optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  address: z.string().max(255).optional(),
});

export const orderSchema = z.object({
  rate: z.string().min(1, "Rate is required.").max(255),
  job_type: z.string().min(1, "Rate is required.").max(255),
  requirements: z.string().min(10, "Requirements is required.").max(65535),
});
export const chatSchema = z.object({
  receiverId: z.string().min(1, "Receiver id is required.").max(255),
});

export const patchOrderSchema = z.object({
  rate: z.string().min(1, "Rate is required.").max(255).optional(),
  job_type: z.string().min(1, "Job type is required.").max(255).optional(),
  status: z.string().min(1, "Status is required.").max(255).optional(),
  requirements: z
    .string()
    .min(10, "Requirements is required.")
    .max(65535)
    .optional(),
});

