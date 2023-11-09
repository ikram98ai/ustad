import { z } from "zod";

export const gigSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  rate: z.string().min(1, "Rate is required.").max(255),
  range: z.string().min(1, "Range is required.").max(255),
  profession: z.string().min(1, "Profession id is required.").max(255),
  description: z.string().min(1, "Description is required.").max(65535),
});
