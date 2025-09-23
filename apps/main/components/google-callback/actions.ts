"use server";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// This action no longer redirects. Instead, it returns the URL or an error.
export async function getGoogleOauthUrl(): Promise<{ url?: string; error?: string }> {
  const session = await getSession();
  if (!session?.user || !session?.token) {
    return { error: "User is not authenticated or session is invalid." };
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/google/auth",
      {
        method: "GET",
        headers: {
          // This is a key change: Ensure the 'Authorization' header is correctly formatted.
          "Authorization": `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        // It's good practice to set a timeout for network requests.
        signal: AbortSignal.timeout(5000), // 5 seconds
      }
    );

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location) {
        return { url: location };
      } else {
        throw new Error("Backend redirect did not contain a Location header.");
      }
    } else {
      // This more detailed logging will help us see exactly what the backend is sending.
      const responseBody = await response.text();
      console.error(
        `Backend returned a non-redirect status: ${response.status}`,
        { responseBody }
      );
      throw new Error(`Received an unexpected status (${response.status}) from the server.`);
    }
  } catch (error) {
    console.error("Failed to initiate Google OAuth:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { error: "The request to the server timed out. Please check your connection and try again." };
    }
    return {
      error: "Could not connect to Google. Please ensure your backend is running and authenticating correctly.",
    };
  }
}

