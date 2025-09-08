"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, type SignInState } from "./actions";
import { FileText, KeyRound } from "lucide-react"; // Import icons from lucide-react

const initialState: SignInState = {
  message: null,
  errors: {},
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? "Signing In..." : "Login"}
    </Button>
  );
}

export default function SignIn() {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-8">
          {" "}
          {/* Increased gap for more space */}
          <div className="grid gap-4 text-center">
            {" "}
            {/* Increased gap */}
            <div className="flex justify-center mb-2">
              <FileText className="h-12 w-12 text-primary" />{" "}
              {/* Made icon larger and primary color */}
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
              />
              {state.errors?.email && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" />
              {state.errors?.password && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            {state.message && (
              <p
                className={`text-sm font-medium ${state.errors ? "text-destructive" : "text-emerald-500"}`}
              >
                {state.message}
              </p>
            )}
            <LoginButton />
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      {/* Right side panel - updated for a more elegant look */}
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-12 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Unlock Your Data's Potential
          </h2>
          <p className="text-muted-foreground max-w-md text-lg">
            Our platform effortlessly extracts valuable information from your
            PDFs, transforming static documents into actionable data.
          </p>
        </div>
        <div className="mt-16">
          <blockquote className="space-y-4 border-l-2 pl-6 italic">
            <p className="text-xl">
              &ldquo;This tool has saved me countless hours of manual data
              entry. It's a game-changer for processing PDF documents.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">
              Sofia Davis, Project Manager
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
