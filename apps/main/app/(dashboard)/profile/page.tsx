import React, { Suspense } from 'react';
import { revalidatePath } from 'next/cache';
import client from '@/lib/fetch-client';
import { FormSkeleton } from "@/components/profile/personal-information";
import { ProfileClient } from '@/components/profile/profile-client';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validators';

// SERVER ACTION: Accepts a plain object for the update.
async function updateUserProfile(updateData: { [key: string]: any }): Promise<{ data?: any; error?: string }> {
  "use server";

  try {
    // The email is no longer in the payload, so no need to delete it.
    
    // Pass the plain object directly to the fetch client.
    const response = await client.patch('api/v1/users/me', updateData);
    
    revalidatePath('/profile');
    return { data: response.data };

  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to update user profile' };
  }
}
// SERVER ACTION for changing password
async function changeUserPassword(
  data: ChangePasswordFormData
): Promise<{ success: boolean; error?: string; message?: string }> {
  "use server";

  const validatedFields = changePasswordSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid data provided." };
  }

  const { oldPassword, newPassword, confirmPassword } = validatedFields.data;
  
  try {
    await client.patch('api/v1/users/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return { success: true, message: "Password updated successfully." };

  } catch (error: any) {
    // This error path must also return a value of the same shape
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

// Main page component
export default async function Profile() {
  let responseData;
  try {
    const response = await client.get('api/v1/users/me', { cache: 'no-store' });
    responseData = response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return (
      <div className="space-y-4 p-4">
        <p className="font-semibold text-red-500">Could not load profile data.</p>
        <p className="text-sm text-muted-foreground">The user was not found or an API error occurred. Please try again later.</p>
      </div>
    );
  }
  
  if (!responseData) {
    console.error("API did not return a user object.");
    return (
      <div className="space-y-4 p-4">
        <p className="font-semibold text-red-500">Profile data is in an unexpected format.</p>
      </div>
    );
  }
  
  const userData = responseData;
  const formData = {
    id: userData.id,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    avatarUrl: userData.avatarUrl || "",
    businessName: userData.businessName || "",
  };

  return (
    <div className="space-y-4">
      <Suspense fallback={<FormSkeleton />}>
        <ProfileClient 
          initialData={formData} 
          updateUserAction={updateUserProfile} 
          changeUserPasswordAction={changeUserPassword}
        />
      </Suspense>
    </div>
  );
}