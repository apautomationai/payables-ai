"use server";

import { z } from "zod";
import { SignInSchema } from "@/lib/validators";

// This is the shape of the state that will be returned from our server action
export type SignInFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  success: boolean;
};

// The server action itself
export async function signInAction(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  // 1. Convert FormData to a plain object
  const rawFormData = Object.fromEntries(formData.entries());

  // 2. Validate the data on the server using your Zod schema
  const validatedFields = SignInSchema.safeParse(rawFormData);

  // 3. If validation fails, return the errors
  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // 4. If validation succeeds, process the data
  const { email, password } = validatedFields.data;

  // The output will now appear in your terminal's server console, not the browser console.
  console.log("Server Action: Successfully validated sign-in data:", {
    email,
    password,
  });

  // In a real application, you would handle the actual authentication here.
  // For example, querying your database or calling an auth service.

  // 5. Return a success message
  return {
    message: "Sign-in successful! Data logged on the server.",
    success: true,
  };
}
