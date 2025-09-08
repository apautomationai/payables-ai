"use server";

import { z } from "zod";

export interface SignUpState {
  message: string | null;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
}

const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  // Validate form fields
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  // Here you would typically handle user creation in your database
  // For this example, we'll just log the data and return a success message
  console.log("Creating user with:", validatedFields.data);

  // Return success state
  return {
    message: "Account created successfully!",
    errors: {},
  };
}
