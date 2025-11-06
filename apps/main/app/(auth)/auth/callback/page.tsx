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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 relative">
        {/* Corner screws/rivets */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        
        {/* Weld marks */}
        <div className="absolute top-4 left-1/4 w-16 h-1 bg-yellow-600/40 blur-[2px]"></div>
        
        <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
          <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
          <h2 className="text-xl font-semibold text-white uppercase">Completing authentication...</h2>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
          <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 relative">
            {/* Corner screws/rivets */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-800 rounded-full border-4 border-gray-500 shadow-[inset_0_0_5px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,1)] z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
              <h2 className="text-xl font-semibold text-white uppercase">Loading...</h2>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackComponent />
    </Suspense>
  );
}

