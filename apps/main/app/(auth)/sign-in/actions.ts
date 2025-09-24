"use server";

import { SignInSchema } from "@/lib/validators";
import { login } from "@/lib/session";


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
  // Add rate limiting check here if needed
  const timestamp = Date.now();
  
  // Validate form data
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
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    // Handle non-200 responses
    if (!response.ok) {
      // Handle 2FA required case
      if (response.status === 403 && data.requiresTwoFactor) {
        return {
          message: "Two-factor authentication required",
          requiresTwoFactor: true,
          success: false,
          timestamp,
        };
      }

      // Handle account locked/disabled
      if (response.status === 423) {
        return {
          message: data.message || "Account is locked. Please try again later.",
          errors: { _form: [data.message || "Account is locked"] },
          success: false,
          timestamp,
        };
      }

      // Handle other errors
      return {
        message: data.message || "Invalid email or password",
        errors: { 
          _form: [data.message || "Invalid email or password"],
          ...(data.errors || {})
        },
        success: false,
        timestamp,
      };
    }

    // Handle successful login
    if (data.token && data.user) {
      await login(data.token, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        ...data.user
      });

      // Return success without redirecting
      return {
        message: "Login successful!",
        success: true,
        redirectTo: "/dashboard",
        timestamp,
      };
    }

    // Handle invalid response format
    return {
      message: "Invalid response from server",
      errors: { _form: ["Invalid response from server"] },
      success: false,
      timestamp,
    };

  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      message: "Could not connect to the server. Please try again.",
      errors: { _form: ["An unexpected error occurred."] },
      success: false,
      timestamp,
    };
  }
}