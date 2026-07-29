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
export const signUpSchema = z.object({
  email: z.email("Enter a valid email address.").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(60),
  phone: z
    .string()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  image: z.url("Enter a valid image URL.").max(500).optional().or(z.literal("")),
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

