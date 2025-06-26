import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email("enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});
export const otpValidation = z.object({
  otp: z
    .string()
    .regex(/^\d{4}$/, "OTP must be a 4-digit number between 0000 and 9999"),
  email: z.email("enter a valid email address"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});
