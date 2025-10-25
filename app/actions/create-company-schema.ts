import { z } from "zod";
export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Name your workspace so teammates know what it is.")
    .max(80, "Keep workspace names under 80 characters.")
    .transform((value) => value.trim()),
  description: z
    .string()
    .max(240, "Short summaries work best. 240 character max.")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
});
