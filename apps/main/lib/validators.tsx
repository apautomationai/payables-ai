import { z } from "zod";

// For Sign Up
export const SignUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

// For Sign In
export const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// For Forgot Password
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
