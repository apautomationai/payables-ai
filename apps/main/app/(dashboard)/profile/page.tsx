import React, { Suspense } from 'react';
import client from '@/lib/fetch-client';
import {PersonalInformationForm, FormSkeleton} from "@/components/profile/personal-information";
import SecurityForm from "@/components/profile/security-form";
import PreferencesForm from "@/components/profile/preferences-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { PersonalInfoFormData } from '@/lib/validators';
import { revalidatePath } from 'next/cache';


async function updateUserProfile(formData: FormData): Promise<{ data?: any; error?: string }> {
  "use server";
  try {
    const updatedUser = await client.put('api/v1/users/updateProfile', formData);
    revalidatePath("/settings");
    return { data: updatedUser };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile." };
  }
}

// --- NEW Data Fetching Component ---
// This async component's rendering will be "suspended" while it fetches data.
async function ProfileFormLoader() {
  try {
    const user = await client.get('api/v1/users/userWithId');
    const initialData: PersonalInfoFormData = {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      businessName: user.businessName ?? "",
      isActive: user.isActive ?? true,
      isBanned: user.isBanned ?? false,
      avatarUrl: user.avatarUrl ?? "",
    };
    
    return (
      <Tabs defaultValue="personal-info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="security">Change Password</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="personal-info">
        {/* @ts-ignore */}
        <PersonalInformationForm initialData={initialData} updateUserAction={updateUserProfile} />
      </TabsContent>
      <TabsContent value="security">
        <SecurityForm />
      </TabsContent>
      <TabsContent value="preferences">
        <PreferencesForm />
      </TabsContent>
    </Tabs>
    );
  } catch (error: any) {
    // If fetching fails, we'll render an error message.
    return (
      <Card>
        <CardHeader><CardTitle>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-500">{error.message || "Could not load profile."}</p></CardContent>
      </Card>
    );
  }
}


// This is the main client component that organizes all the forms on the profile page.
export default async function Profile() {

  return (


      
      <div className="space-y-4">
        <Suspense fallback={<FormSkeleton />}>
          <ProfileFormLoader />
        </Suspense>
      </div>
      
    
 
  );
}