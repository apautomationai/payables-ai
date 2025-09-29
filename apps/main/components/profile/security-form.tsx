"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validators";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

// Define the props for the form component
type SecurityFormProps = {
  changeUserPasswordAction: (data: ChangePasswordFormData) => Promise<{ success: boolean; error?: string; message?: string }>;
};

// A helper component for the password strength criteria
const StrengthCriteria = ({ label, meets }: { label: string; meets: boolean }) => (
  <div className={`flex items-center text-sm ${meets ? 'text-green-600' : 'text-muted-foreground'}`}>
    {meets ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
    <span>{label}</span>
  </div>
);


export default function SecurityForm({ changeUserPasswordAction }: SecurityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });
  
  // Watch the newPassword field to give real-time feedback
  const newPassword = watch("newPassword");

  const passwordStrength = useMemo(() => {
    const strength = {
      length: (newPassword || "").length >= 8,
      number: /\d/.test(newPassword || ""),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || ""),
    };
    return strength;
  }, [newPassword]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    const result = await changeUserPasswordAction(data);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      setServerError(result.error || "An unknown error occurred.");
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password below.
          </CardDescription>
        </CardHeader>

        <CardContent className="border-t pt-6">
           {serverError && (
            <div className="mb-6 p-3 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
              {serverError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {/* Left Column for Context */}
            <div className="md:col-span-1">
              <h3 className="text-base font-semibold leading-7">Requirements</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A strong password helps prevent unauthorized access to your account.
              </p>
              <div className="mt-6 space-y-2">
                <StrengthCriteria label="At least 6 characters" meets={passwordStrength.length} />
                <StrengthCriteria label="Contains a number" meets={passwordStrength.number} />
                <StrengthCriteria label="Contains a special character" meets={passwordStrength.specialChar} />
              </div>
            </div>

            {/* Right Column for Form Fields */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <div className="relative">
                  <Input id="oldPassword" type={showOldPassword ? "text" : "password"} {...register("oldPassword")} />
                  <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full px-3" onClick={() => setShowOldPassword((p) => !p)}>
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.oldPassword && <p className="text-sm text-red-500 mt-1">{errors.oldPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input id="newPassword" type={showNewPassword ? "text" : "password"} {...register("newPassword")} />
                  <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full px-3" onClick={() => setShowNewPassword((p) => !p)}>
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} {...register("confirmPassword")} />
                   <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full px-3" onClick={() => setShowConfirmPassword((p) => !p)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}