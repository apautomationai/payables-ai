"use server";

import { signUpSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

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
};

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Form submission failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  // This is the key change: The keys now match the camelCase format
  // expected by your backend API's validation layer.
  const requestBody = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend Error Response:", data);

      if (response.status === 409) {
        // Email already exists
        return {
          message: data.message || "An account with this email already exists.",
          errors: {
            email: [
              data.message || "An account with this email already exists.",
            ],
          },
          success: false,
        };
      }
      return {
        message: data.message || "An unexpected error occurred.",
        errors: { _form: [data.message || "An unexpected error occurred."] },
        success: false,
      };
    }

    console.log("New user created successfully:", data);
  } catch (error) {
    console.error("Network or fetch error:", error);
    return {
      message:
        "Could not connect to the server. Please check if your backend is running and accessible.",
      errors: { _form: ["Could not connect to the server."] },
      success: false,
    };
  }

  redirect("/sign-in?signup=success");
}
