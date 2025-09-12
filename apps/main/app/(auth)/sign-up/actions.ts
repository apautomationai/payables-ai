"use server";

import { z } from "zod";
import { SignUpSchema } from "@/lib/validators";

export type SignUpFormState = {
  message: string;
  errors?: {
    email?: string[];
    phone?: string[];
    password?: string[];
  };
  success: boolean;
};

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // On successful validation, log the data to the server console
  console.log("Sign-up data received on server:", validatedFields.data);

  // In a real application, you would handle database logic here,
  // such as creating a new user record.

  return {
    message: "Your account has been created successfully!",
    success: true,
  };
}
