"use client";

import React, { useEffect, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AtSign, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import axios from "axios";
import { SignInSchema } from "@/lib/validators";
import { setCookie } from "cookies-next";

interface SignInFormState {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success: boolean;
  requiresTwoFactor?: boolean;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.566,44,31.2,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#ff5722" d="M22 22H6V6h16v16z"/>
    <path fill="#4caf50" d="M42 22H26V6h16v16z"/>
    <path fill="#ffc107" d="M42 42H26V26h16v16z"/>
    <path fill="#03a9f4" d="M22 42H6V26h16v16z"/>
  </svg>
);

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      type="submit" 
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Signing In...
        </div>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

function SignInFormComponent() {
  const [state, setState] = useState<SignInFormState>({
    message: "",
    success: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      toast.success("Account created successfully!", {
        description: "You can now sign in with your new credentials.",
      });
    }
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Validate with Zod
    const validatedFields = SignInSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      setState({
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${apiUrl}/api/v1/users/login`,
        { email, password },
        {
          withCredentials: true, // Important: enables cookie handling
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Check if response is successful and contains token
      if (response.data && response.data.token) {
        // Set local cookies for Next.js access
        setCookie("token", response.data.token, {
          maxAge: 24 * 60 * 60, // 1 day
          path: "/",
          // sameSite: "none",
          secure: process.env.NODE_ENV === "production",
        });

        if (response.data.user?.id) {
          setCookie("userId", String(response.data.user.id), {
            maxAge: 24 * 60 * 60, // 1 day
            path: "/",
            // sameSite: "none",
            secure: process.env.NODE_ENV === "production",
          });
        }

        toast.success("Login Successful", {
          description: "You have been successfully logged in!",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setState({
          message: "Invalid response from server",
          errors: { _form: ["Invalid response from server"] },
          success: false,
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.response) {
        const data = error.response.data;
        
        // Handle various error scenarios from the API
        if (error.response.status === 403 && data.requiresTwoFactor) {
          setState({
            message: "Two-factor authentication required",
            requiresTwoFactor: true,
            success: false,
          });
        } else if (error.response.status === 423) {
          setState({
            message: data.message || "Account is locked.",
            errors: { _form: [data.message || "Account is locked"] },
            success: false,
          });
        } else {
          setState({
            message: data.message || "Invalid email or password",
            errors: {
              _form: [data.message || "Invalid email or password"],
              ...(data.errors || {}),
            },
            success: false,
          });
        }
      } else {
        setState({
          message: "Failed to connect to the server",
          errors: {
            _form: ["Failed to connect to the server. Please try again later."],
          },
          success: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show error message when state changes
  useEffect(() => {
    if (state?.message && !state?.success) {
      toast.error("Sign In Failed", {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <div className="relative">
      {/* Animated Gradient Background Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-75 blur-xl animate-pulse-slow"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-lg animate-rotate"></div>
      
      {/* Main Card with Gradient Border */}
      <Card className="relative w-full max-w-md bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
        {/* Animated Gradient Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shine"></div>
        
        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 animate-shine"></div>
              <Lock className="h-8 w-8 text-white relative z-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-300 text-base mt-2">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleSignIn}
              className="h-11 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200 rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 group-hover:animate-shine"></div>
              <GoogleIcon className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">Google</span>
            </Button>
            <Button 
              variant="outline" 
              disabled
              className="h-11 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200 rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 group-hover:animate-shine"></div>
              <MicrosoftIcon className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">Microsoft</span>
            </Button>
          </div>

          {/* Divider with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900 px-3 text-sm text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-300 font-medium text-sm">
                Email Address
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 relative z-10"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </div>
              {state.errors?.email && (
                <p className="text-sm text-red-400 mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 font-medium text-sm">
                  Password
                </Label>
                <Link
                  href="/forget-password"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 relative z-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300 z-20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </div>
              {state.errors?.password && (
                <p className="text-sm text-red-400 mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            {state.errors?._form && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
                <p className="text-sm text-red-400 text-center relative z-10">{state.errors._form[0]}</p>
              </div>
            )}

            <SubmitButton isLoading={isLoading} />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-6 border-t border-gray-700 relative z-10">
          <div className="text-sm text-gray-400 text-center">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .animate-rotate {
          animation: rotate 6s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-8 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shine"></div>
        <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4"></div>
        <div className="h-8 bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-700 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-700 rounded-xl"></div>
          <div className="h-10 bg-gray-700 rounded-xl"></div>
          <div className="h-12 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    }>
      <SignInFormComponent />
    </Suspense>
  );
}