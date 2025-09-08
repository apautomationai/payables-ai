"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { CheckCircle, KeyRound, UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpAction, type SignUpState } from "./actions";

const initialState: SignUpState = {
  message: null,
  errors: {},
};

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" aria-disabled={pending}>
      {pending ? "Creating Account..." : "Create an account"}
    </Button>
  );
}

export default function SignUp() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  // Determine if the form submission was successful
  const isSuccess =
    state.message && (!state.errors || Object.keys(state.errors).length === 0);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left side panel */}
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

      {/* Right side form */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[420px] gap-6">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
              <h1 className="text-3xl font-bold">Account Created!</h1>
              <p className="text-balance text-muted-foreground">
                {state.message} You can now sign in with your new account.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 text-center">
                <div className="flex justify-center mb-2">
                  <UserPlus className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your information to create a new account
                </p>
              </div>
              <form action={formAction} className="grid gap-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      name="firstName"
                      placeholder="Max"
                      required
                    />
                    {state.errors?.firstName && (
                      <p className="text-sm font-medium text-destructive">
                        {state.errors.firstName[0]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      name="lastName"
                      placeholder="Robinson"
                      required
                    />
                    {state.errors?.lastName && (
                      <p className="text-sm font-medium text-destructive">
                        {state.errors.lastName[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                  {state.errors?.email && (
                    <p className="text-sm font-medium text-destructive">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                  {state.errors?.password && (
                    <p className="text-sm font-medium text-destructive">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>
                {state.message &&
                  state.errors &&
                  Object.keys(state.errors).length > 0 && (
                    <p className="text-sm font-medium text-destructive text-center">
                      {state.message}
                    </p>
                  )}
                <SignUpButton />
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Sign up with Google
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
