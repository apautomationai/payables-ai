"use server";

import { SignInSchema } from "@/lib/validators";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SignInFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success: boolean;
  requiresTwoFactor?: boolean;
  redirectTo?: string;
  timestamp?: number;
};

export async function signInAction(
  prevState: SignInFormState | null,
  formData: FormData
): Promise<SignInFormState> {
  const timestamp = Date.now();

  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      timestamp,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle various error scenarios from the API
      if (response.status === 403 && data.requiresTwoFactor) {
        return {
          message: "Two-factor authentication required",
          requiresTwoFactor: true,
          success: false,
          timestamp,
        };
      }
      if (response.status === 423) {
        return {
          message: data.message || "Account is locked.",
          errors: { _form: [data.message || "Account is locked"] },
          success: false,
          timestamp,
        };
      }
      return {
        message: data.message || "Invalid email or password",
        errors: {
          _form: [data.message || "Invalid email or password"],
          ...(data.errors || {}),
        },
        success: false,
        timestamp,
      };
    }

    // Handle successful login
    if (data.token) {
      const cookieStore = await cookies();

      // Set the token in an HTTP-only cookie for security
      cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      // Set user ID in a separate cookie for client-side access
      if (data.user?.id) {
        cookieStore.set("userId", String(data.user.id), {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      
      // This will throw a special NEXT_REDIRECT error
      redirect("/dashboard");
    }

    // Fallback error if the server response is successful but invalid
    return {
      message: "Invalid response from server",
      errors: { _form: ["Invalid response from server"] },
      success: false,
      timestamp,
    };
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Sign in error:", error);
    return {
      message: "Failed to connect to the server",
      errors: {
        _form: ["Failed to connect to the server. Please try again later."],
      },
      success: false,
      timestamp,
    };
  }
}
