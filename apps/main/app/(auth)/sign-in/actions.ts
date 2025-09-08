"use server";

import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type SignInState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signInAction(prevState: SignInState, formData: FormData) {
  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  // Here you would typically handle the actual authentication logic,
  // e.g., call your authentication API, check credentials, etc.
  console.log("Authentication successful for:", validatedFields.data.email);

  // For this example, we'll just return a success message.
  // In a real app, you would likely redirect the user upon success
  // using `redirect()` from `next/navigation`.
  return {
    message: "Login successful!",
  };
}
