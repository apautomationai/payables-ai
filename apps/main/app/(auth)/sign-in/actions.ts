"use server";

import { SignInSchema } from "@/lib/validators";
import { login } from "@/lib/session";
import { redirect } from "next/navigation";

export type SignInFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success: boolean;
};

export async function signInAction(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Form submission failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Call your backend login endpoint
    const response = await fetch("http://localhost:5000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Invalid email or password.",
        errors: { _form: [data.message || "Invalid email or password."] },
        success: false,
      };
    }

    // If login is successful, the backend should return the user and a token
    // We'll use the user data to create a secure session cookie
    await login(data.user);
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      message: "Could not connect to the server. Please try again.",
      errors: { _form: ["An unexpected error occurred."] },
      success: false,
    };
  }

  // On successful sign-in, redirect to the dashboard
  redirect("/dashboard");
}
