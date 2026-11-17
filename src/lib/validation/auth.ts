import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

/** Mirrors the body the old site POSTs to users/register (a carrier sign-up request — no password). */
export const registerSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  phone_number: z.string().trim().min(10, "Enter a valid phone number"),
  email: z.email("Enter a valid email"),
  address: z.string().trim().min(1, "Address is required"),
  company_name: z.string().trim().min(1, "Company name is required"),
  state: z.string().trim().min(1, "State is required"),
  city: z.string().trim().min(1, "City is required"),
  zip: z.string().trim().min(3, "ZIP is required"),
  mc_Number: z.string().trim().min(1, "MC number is required"),
  us_Dot_No: z.string().trim().min(1, "US DOT number is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
