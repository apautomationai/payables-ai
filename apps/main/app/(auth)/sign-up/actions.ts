// app/(auth)/sign-up/actions.ts
"use server";

import { signUpSchema } from "@/lib/validators";


export type SignUpFormState = {
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success: boolean;
  redirectTo?: string;
};

export async function signUpAction(
  prevState: SignUpFormState | null,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password 
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Registration failed",
        errors: { _form: [data.message || "Registration failed"] },
        success: false,
      };
    }

    // On successful registration
    return {
      message: "Registration successful! Redirecting to sign in...",
      success: true,
      redirectTo: "/sign-in?signup=success",
    };

  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      message: "Could not connect to the server. Please try again.",
      errors: { _form: ["An unexpected error occurred."] },
      success: false,
    };
  }
}