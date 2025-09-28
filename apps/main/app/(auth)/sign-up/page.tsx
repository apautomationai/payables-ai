"use client";

import React, { useEffect, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { AtSign, Lock, Loader2, User } from "lucide-react";
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
import { signUpAction, SignUpFormState } from "@/app/(auth)/sign-up/actions";

const initialState: SignUpFormState = {
  message: "",
  success: false,
};

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

const OutlookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#ff5722" d="M22 22H6V6h16v16z"/>
    <path fill="#4caf50" d="M42 22H26V6h16v16z"/>
    <path fill="#ffc107" d="M42 42H26V26h16v16z"/>
    <path fill="#03a9f4" d="M22 42H6V26h16v16z"/>
  </svg>
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden group"
      type="submit" 
      disabled={pending}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:animate-shine"></div>
      {pending ? (
        <div className="flex items-center justify-center relative z-10">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Creating Account...
        </div>
      ) : (
        <span className="relative z-10">Create an Account</span>
      )}
    </Button>
  );
}

export default function SignUpPage() {
const [state, formAction] = useActionState(signUpAction, {
    message: "",
    success: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      // Show success message
      toast.success("Account created successfully!", {
        description: "You can now sign in with your new credentials.",
      });
      // Redirect to sign-in page
      router.push(state.redirectTo);
    } else if (state?.message && !state?.success) {
      // Show error message
      toast.error("Sign Up Failed", {
        description: state.message,
      });
    }
  }, [state, router]);

  return (
    <div className="relative">
      {/* Animated Gradient Background Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-75 blur-xl animate-pulse-slow"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-lg animate-rotate"></div>
      
      {/* Main Card with Gradient Border */}
      <Card className="relative w-full max-w-md bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
        {/* Animated Gradient Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shine"></div>
        
        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 relative overflow-hidden">
              {/* Icon Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 animate-shine"></div>
              <User className="h-8 w-8 text-white relative z-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold  bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-300 text-base mt-2">
            Get started with Payable.ai today
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-11 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200 rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 group-hover:animate-shine"></div>
              <GoogleIcon className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">Google</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-11 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200 rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 group-hover:animate-shine"></div>
              <OutlookIcon className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">Outlook</span>
            </Button>
          </div>

          {/* Divider with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900 px-3 text-sm text-gray-400">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-gray-300 font-medium text-sm">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    className="pl-10 h-11 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 relative z-10"
                  />
                  {/* Input Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></div>
                </div>
                {state.errors?.firstName && (
                  <p className="text-sm text-red-400 mt-1">{state.errors.firstName[0]}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-gray-300 font-medium text-sm">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="pl-10 h-11 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 relative z-10"
                  />
                  {/* Input Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></div>
                </div>
                {state.errors?.lastName && (
                  <p className="text-sm text-red-400 mt-1">{state.errors.lastName[0]}</p>
                )}
              </div>
            </div>

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
                />
                {/* Input Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </div>
              {state.errors?.email && (
                <p className="text-sm text-red-400 mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-300 font-medium text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="8+ characters"
                  className="pl-10 h-11 bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 relative z-10"
                />
                {/* Input Shine Effect */}
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

            <SubmitButton />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4 pt-6 border-t border-gray-700 relative z-10">
          <div className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Sign In
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