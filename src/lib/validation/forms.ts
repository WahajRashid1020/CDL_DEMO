import { z } from "zod";

/** Same body as the old site's blogs/contact-us. */
export const contactSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Same body as the old site's blogs/apply-now; `resume` is the PDF as base64 (no data: prefix). */
export const applySchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  position: z.string().trim().min(1, "Choose a position"),
  message: z.string().trim().max(2000).optional().default(""),
  resume: z.string().min(1, "Attach your résumé as a PDF"),
});
export type ApplyInput = z.input<typeof applySchema>;
