"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setCookie } from "cookies-next";

function AuthCallbackComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication Failed", {
        description: decodeURIComponent(error),
      });
      router.push("/sign-in");
      return;
    }

    if (token && userId) {
      // Set cookies
      setCookie("token", token, {
        maxAge: 24 * 60 * 60, // 1 day
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      setCookie("userId", userId, {
        maxAge: 24 * 60 * 60, // 1 day
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      toast.success("Login Successful", {
        description: "You have been successfully logged in!",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      toast.error("Authentication Failed", {
        description: "Invalid response from server",
      });
      router.push("/sign-in");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <h2 className="text-xl font-semibold text-white">Completing authentication...</h2>
          <p className="text-sm text-gray-400 text-center">
            Please wait while we sign you in.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <h2 className="text-xl font-semibold text-white">Loading...</h2>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackComponent />
    </Suspense>
  );
}

