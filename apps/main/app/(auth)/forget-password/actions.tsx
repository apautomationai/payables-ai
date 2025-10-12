"use server";

import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/validators";

export type ForgotPasswordFormState = {
  message: string;
  errors?: {
    email?: string[];
    _form?: string[];
  };
  success: boolean;
};

export async function forgotPasswordAction(
  prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const validatedFields = forgotPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid email address.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  
  try {
    const { email } = validatedFields.data;
    // In a real application, you would call your backend here, e.g.:
    // await fetch("http://localhost:5000/api/auth/forgot-password", ...);
    console.log(`Password reset requested for email: ${email}`);
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      errors: { _form: ["An unexpected error occurred."] },
      success: false,
    };
  }

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
    success: true,
  };
}
