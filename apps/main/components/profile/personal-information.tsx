"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { personalInfoSchema, type PersonalInfoFormData } from "@/lib/validators";
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
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

type PersonalInfoFormProps = {
  initialData: PersonalInfoFormData;
  updateUserAction: (updateData: { [key: string]: any }) => Promise<{ data?: any; error?: string }>;
  onCancel: () => void;
  onSaveSuccess: (updatedData: any) => void;
};

export function PersonalInformationForm({ 
  initialData, 
  updateUserAction, 
  onCancel, 
  onSaveSuccess 
}: PersonalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
  });

  const { firstName, lastName, email, avatarUrl } = watch();

  const onValidationErrors = (errors: any) => {
    toast.error("Please check the form for errors before submitting.");
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!isDirty) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const updatePayload: { [key: string]: any } = {};
      if (dirtyFields.firstName) updatePayload.firstName = data.firstName;
      if (dirtyFields.lastName) updatePayload.lastName = data.lastName;
      if (dirtyFields.phone) updatePayload.phone = data.phone || '';
      if (dirtyFields.businessName) updatePayload.businessName = data.businessName || '';
      
      const result = await updateUserAction(updatePayload);

      if (result.error) {
        setServerError(result.error);
        toast.error(result.error);
      } else {
        toast.success('Profile updated successfully');
        onSaveSuccess({ ...initialData, ...data, avatarUrl });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onValidationErrors)}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Personal Information</CardTitle>
          <CardDescription>Update your personal information below.</CardDescription>
        </CardHeader>
        
        <CardContent className="border-t pt-6">
          {serverError && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
              {serverError}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h3 className="text-base font-semibold leading-7">Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your avatar is synced from your login provider.
              </p>
              <div className="mt-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback>
                    {`${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} disabled={isSubmitting} className="mt-2" />
                  {errors.firstName && <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} disabled={isSubmitting} className="mt-2" />
                  {errors.lastName && <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled readOnly className="mt-2 cursor-not-allowed bg-muted" />
                <p className="mt-2 text-sm text-muted-foreground">Your email address cannot be changed.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} disabled={isSubmitting} className="mt-2" />
                  {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" {...register('businessName')} disabled={isSubmitting} className="mt-2" />
                  {errors.businessName && <p className="mt-2 text-sm text-red-500">{errors.businessName.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-4 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export const FormSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
           <div className="space-y-2 md:col-span-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );