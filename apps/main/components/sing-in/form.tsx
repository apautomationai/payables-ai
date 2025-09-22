"use client";

import React, { useEffect, Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { AtSign, Lock, Loader2 } from "lucide-react";
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
import { signInAction, SignInFormState } from "@/app/(auth)/sign-in/actions";

const initialState: SignInFormState = {
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
    <path
      fill="#0072c6"
      d="M25.21,4.021H11.53c-1.39,0-2.52,1.13-2.52,2.52v34.92c0,1.39,1.13,2.52,2.52,2.52h13.68c1.39,0,2.52-1.13,2.52-2.52V6.541C27.73,5.151,26.6,4.021,25.21,4.021z"
    />
    <path
      fill="#ffffff"
      d="M21.28,15.11c-1.36-0.61-2.93-1.12-4.59-1.31c-2.31-0.26-4.38,1.69-4.38,3.96v12.5c0,2.27,2.07,4.22,4.38,3.96c1.66-0.19,3.23-0.7,4.59-1.31V15.11z"
    />
    <path
      fill="#26a5e0"
      d="M36.47,15.11v17.78c0,1.39-1.13,2.52-2.52,2.52s-2.52-1.13-2.52-2.52V15.11c0-1.39,1.13-2.52,2.52-2.52S36.47,13.72,36.47,15.11z"
    />
  </svg>
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Sign In"}
    </Button>
  );
}

function SignInFormComponent() {
  const [state, formAction] = useActionState(signInAction, initialState);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      toast.success("Account created successfully!", {
        description: "You can now sign in with your new credentials.",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error("Sign-In Failed", { description: state.message });
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <GoogleIcon className="mr-2 h-5 w-5" /> Google
          </Button>
          <Button variant="outline">
            <OutlookIcon className="mr-2 h-5 w-5" /> Outlook
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="dark:bg-gray-900 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forget-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                className="pl-10"
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>
          {state.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form[0]}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormComponent />
    </Suspense>
  );
}
