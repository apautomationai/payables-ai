"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// This component runs on the client to process the callback from Google.
export default function GoogleCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // This component no longer needs to call a server action.
    // Its only job is to read the parameters from the URL and redirect.
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      // If Google returns an error, redirect back to the settings page with an error status.
      router.replace(`/settings?error=google_oauth_failed`);
    } else if (code) {
      // If a code is present, it implies success from Google.
      // The backend has already handled the token exchange.
      // We just need to redirect back to the settings page with a success status.
      router.replace(`/settings?google_connected=true`);
    } else {
      // If neither a code nor an error is present, it's an invalid callback.
      router.replace(`/settings?error=invalid_callback`);
    }
  }, [searchParams, router]);

  // This component doesn't render any UI itself, it just handles the logic
  // and redirects. The loader is handled by the parent server component.
  return null;
}

