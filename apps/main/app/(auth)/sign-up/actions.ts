"use server";

import { z } from "zod";
import { signUpSchema } from "@/lib/validators";

export type SignUpFormState = {
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    // phone?: string[];
    password?: string[];
  };
  success: boolean;
};

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  // Validate the form data
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // If validation fails, return the errors
  if (!validatedFields.success) {
    return {
      message: "Form submission failed. Please check the errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // --- Handle successful submission ---
  // For demonstration, we'll log the data to the console.
  // In a real application, you would create the user in your database here.
  console.log("New user signed up with the following data:");
  console.log({
    firstName: validatedFields.data.firstName,
    lastName: validatedFields.data.lastName,
    email: validatedFields.data.email,
    // phone: validatedFields.data.phone,
  });

  // Return a success message
  return {
    message: "Your account has been created successfully!",
    success: true,
  };
}
