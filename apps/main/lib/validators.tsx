import { z } from "zod";

// For Sign Up
// --- Sign Up ---
export const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  // phone: z.string().min(20, { message: "Please enter a valid phone number." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
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

// --- Forgot Password ---
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});
