"use client";

import React, { useEffect, useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { AtSign, Loader2, ArrowLeft } from "lucide-react";
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
import {
  forgotPasswordAction,
  ForgotPasswordFormState,
} from "@/app/(auth)/forget-password/actions";

const initialState: ForgotPasswordFormState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
    </Button>
  );
}

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Request Sent", { description: state.message });
      } else {
        toast.error("Request Failed", { description: state.message });
      }
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Forgot Password
        </CardTitle>
        <CardDescription>
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          {state.errors?._form && (
            <p className="text-sm text-red-500">{state.errors._form[0]}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" asChild>
          <Link href="/sign-in">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
