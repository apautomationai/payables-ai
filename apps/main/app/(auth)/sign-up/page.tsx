"use client";

import React, { useEffect, useActionState } from "react";
import Link from "next/link";
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
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
        </>
      ) : (
        "Create an Account"
      )}
    </Button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error("Sign-Up Failed", {
        description: state.errors?._form
          ? state.errors._form[0]
          : state.message,
      });
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create an Account
        </CardTitle>
        <CardDescription>Get started with Payable.ai today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => console.log("Sign up with Google")}
          >
            <GoogleIcon className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log("Sign up with Outlook")}
          >
            <OutlookIcon className="mr-2 h-4 w-4" /> Outlook
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="John" />
              {state.errors?.firstName && (
                <p className="text-sm text-red-500">
                  {state.errors.firstName[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" />
              {state.errors?.lastName && (
                <p className="text-sm text-red-500">
                  {state.errors.lastName[0]}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8+ characters"
            />
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
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
