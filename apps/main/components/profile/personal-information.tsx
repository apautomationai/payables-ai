"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
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
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

// Define the component's props, including the Server Action passed from the parent
type PersonalInfoFormProps = {
  initialData: PersonalInfoFormData;
  updateUserAction: (formData: FormData) => Promise<{ data?: any; error?: string }>;
};

export function PersonalInformationForm({ initialData, updateUserAction }: PersonalInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const avatarFileRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
  });

  const { firstName, lastName, email, isBanned, isActive, avatarUrl } = watch();
  const avatarFileRegistration = register('avatarFile');

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    reset(initialData);
    setPreviewImage(null);
    setIsEditing(false);
    setServerError(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setPreviewImage(URL.createObjectURL(file));
      }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!isDirty) {
      setIsEditing(false);
      return;
    }
  
    setIsSubmitting(true);
    setServerError(null);
    const formData = new FormData();
    
    for (const field of Object.keys(dirtyFields) as (keyof PersonalInfoFormData)[]) {
        if (field === 'avatarFile' && data.avatarFile?.length) {
            formData.append('avatar', data.avatarFile[0]);
        } else if (data[field] !== undefined) {
             formData.append(field, data[field] as string);
        }
    }

    const response = await updateUserAction(formData);

    if (response.data) {
        const updatedFormData = {
          firstName: response.data.firstName ?? "",
          lastName: response.data.lastName ?? "",
          email: response.data.email ?? "",
          phone: response.data.phone ?? "",
          businessName: response.data.businessName ?? "",
          isActive: response.data.isActive ?? true,
          isBanned: response.data.isBanned ?? false,
          avatarUrl: response.data.avatarUrl ?? "",
        };
        reset(updatedFormData);
        setPreviewImage(null);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    } else {
        setServerError(response.error || "An unknown error occurred");
        toast.error(response.error || "Failed to update profile.");
    }
    setIsSubmitting(false);
  };

  const avatarSrc = previewImage || avatarUrl || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarSrc} alt="Profile Avatar" />
                        <AvatarFallback>{firstName?.[0]}{lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={() => avatarFileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
                            aria-label="Change profile picture"
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                    )}
                    <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp"
                        name={avatarFileRegistration.name}
                        onBlur={avatarFileRegistration.onBlur}
                        ref={(e) => {
                            avatarFileRegistration.ref(e);
                            avatarFileRef.current = e;
                        }}
                        onChange={(e) => {
                            avatarFileRegistration.onChange(e);
                            handleAvatarChange(e);
                        }}
                    />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{firstName} {lastName}</h3>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <Badge className={cn("mt-2", isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800")}>
                    {isBanned ? "Banned" : isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
            </div>
            {errors.avatarFile && <p className="text-sm text-red-500 pt-1">{errors.avatarFile.message as string}</p>}
            {serverError && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">{serverError}</div>}
          
            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} disabled={!isEditing || isSubmitting} />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} disabled={!isEditing || isSubmitting} />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} disabled className="bg-gray-100 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" {...register('phone')} disabled={!isEditing || isSubmitting} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" {...register('businessName')} disabled={!isEditing || isSubmitting} />
                  {errors.businessName && <p className="text-sm text-red-500">{errors.businessName.message}</p>}
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleEdit}>Edit Profile</Button>
            )}
        </CardFooter>
      </Card>
    </form>
  );
}


// --- ADD THIS EXPORTED SKELETON COMPONENT AT THE END OF THE FILE ---
export const FormSkeleton = () => (
  <Card>
      <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
              </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
          </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Skeleton className="h-10 w-24" />
      </CardFooter>
  </Card>
);