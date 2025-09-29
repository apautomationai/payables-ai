"use client";

import React, { useState } from 'react';
import { PersonalInformationForm } from "@/components/profile/personal-information";
import { ProfileDisplayCard } from "@/components/profile/profile-display-card";
import SecurityForm from "@/components/profile/security-form";
import PreferencesForm from "@/components/profile/preferences-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import type { PersonalInfoFormData, ChangePasswordFormData } from "@/lib/validators";

// Define the types for the props this component will receive
type ProfileClientProps = {
  initialData: PersonalInfoFormData;
  updateUserAction: (updateData: { [key: string]: any }) => Promise<{ data?: any; error?: string }>;
  // Add the new action prop type
  changeUserPasswordAction: (data: ChangePasswordFormData) => Promise<{ success: boolean; error?: string; message?: string }>;
};

export function ProfileClient({ 
  initialData, 
  updateUserAction, 
  changeUserPasswordAction 
}: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(initialData);

  const handleSaveSuccess = (updatedData: PersonalInfoFormData) => {
    setCurrentUserData(updatedData);
    setIsEditing(false);
  };

  return (
    <Tabs defaultValue="personal-info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="security">Change Password</TabsTrigger>
        {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
      </TabsList>
      <TabsContent value="personal-info">
        {isEditing ? (
          <PersonalInformationForm
            initialData={currentUserData}
            updateUserAction={updateUserAction}
            onCancel={() => setIsEditing(false)}
            onSaveSuccess={handleSaveSuccess}
          />
        ) : (
          <ProfileDisplayCard
            user={currentUserData}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </TabsContent>
      <TabsContent value="security">
        {/* Pass the action down to the security form */}
        <SecurityForm changeUserPasswordAction={changeUserPasswordAction} />
      </TabsContent>
      {/* <TabsContent value="preferences">
        <PreferencesForm />
      </TabsContent> */}
    </Tabs>
  );
}