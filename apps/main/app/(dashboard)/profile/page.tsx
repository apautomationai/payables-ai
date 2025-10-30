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

// Separate component to handle data fetching
async function ProfileWrapper({
  updateUserAction,
  changeUserPasswordAction
}: {
  updateUserAction: any;
  changeUserPasswordAction: any;
}) {
  let responseData;
  let hasError = false;

  try {
    const response = await client.get('api/v1/users/me', { cache: 'no-store' });
    responseData = response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    hasError = true;
    // For incomplete users, we'll still show the profile with subscription tab
  }

  let formData;
  if (responseData) {
    formData = {
      firstName: responseData.firstName || "",
      lastName: responseData.lastName || "",
      email: responseData.email || "",
      phone: responseData.phone || "",
      avatarUrl: responseData.avatarUrl || "",
      businessName: responseData.businessName || "",
    };
  } else {
    // Default data for incomplete users
    formData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatarUrl: "",
      businessName: "",
    };
  }

  return (
    <ProfileClient
      initialData={formData}
      updateUserAction={updateUserAction}
      changeUserPasswordAction={changeUserPasswordAction}
      showError={hasError}
    />
  );
}

// Main page component
export default function Profile() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<FormSkeleton />}>
        <ProfileWrapper
          updateUserAction={updateUserProfile}
          changeUserPasswordAction={changeUserPassword}
        />
      </Suspense>
    </div>
  );
}