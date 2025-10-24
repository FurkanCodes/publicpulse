import { z } from "zod";

export const createFeatureSchema = z.object({
  title: z
    .string()
    .min(3, "Give your feature a descriptive title.")
    .max(120, "Keep the title under 120 characters."),
  description: z
    .string()
    .max(600, "Keep descriptions concise (max 600 characters).")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
});
