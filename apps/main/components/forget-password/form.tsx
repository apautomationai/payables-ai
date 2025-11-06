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
    <Button 
      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold py-3 px-4 rounded-none transition-all duration-300 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-400/60 border-2 border-yellow-600 uppercase" 
      type="submit" 
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Sending...
        </div>
      ) : (
        "Send Reset Link"
      )}
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
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-none shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-8 border-gray-600 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2 duration-500 relative">
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
      
      <CardHeader className="text-center relative z-10">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-none flex items-center justify-center shadow-[0_0_30px_rgba(253,176,34,0.5),inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-yellow-600/60 mx-auto mb-3 relative">
            <AtSign className="h-8 w-8 text-gray-900 relative z-10" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-gray-300 mt-2">
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 font-medium text-sm">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-20" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-11 bg-gray-800 border-4 border-gray-600 text-white placeholder-gray-400 rounded-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-600 transition-all duration-300"
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-red-400 mt-1">{state.errors.email[0]}</p>
            )}
          </div>
          {state.errors?._form && (
            <div className="p-3 bg-red-900/20 border-4 border-red-800 rounded-none">
              <p className="text-sm text-red-400 text-center">{state.errors._form[0]}</p>
            </div>
          )}
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center relative z-10 border-t-4 border-gray-600">
        <Button variant="link" asChild className="text-yellow-400 hover:text-yellow-300">
          <Link href="/sign-in">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
