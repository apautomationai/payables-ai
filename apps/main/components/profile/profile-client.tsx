"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PersonalInformationForm } from "@/components/profile/personal-information";
import { ProfileDisplayCard } from "@/components/profile/profile-display-card";
import SecurityForm from "@/components/profile/security-form";
import PreferencesForm from "@/components/profile/preferences-form";
import { SubscriptionTab } from "@/components/subscription/subscription-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import type { PersonalInfoFormData, ChangePasswordFormData } from "@/lib/validators";

// Define the types for the props this component will receive
type ProfileClientProps = {
  initialData: PersonalInfoFormData;
  updateUserAction: (updateData: { [key: string]: any }) => Promise<{ data?: any; error?: string }>;
  // Add the new action prop type
  changeUserPasswordAction: (data: ChangePasswordFormData) => Promise<{ success: boolean; error?: string; message?: string }>;
  showError?: boolean; // Show error state for incomplete users
};

export function ProfileClient({
  initialData,
  updateUserAction,
  changeUserPasswordAction,
  showError = false
}: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("personal");

  const searchParams = useSearchParams();
  const setupRequired = searchParams.get('setup') === 'required';
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    // Set active tab based on URL parameter
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSaveSuccess = (updatedData: PersonalInfoFormData) => {
    setCurrentUserData(updatedData);
    setIsEditing(false);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      {showError && setupRequired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Profile Access Limited
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your profile information is not available until you complete your subscription setup.
                  Please go to the Subscription tab to set up payment and start your trial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <TabsList>
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="security">Change Password</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
      </TabsList>
      <TabsContent value="personal">
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
      <TabsContent value="subscription">
        <SubscriptionTab setupRequired={setupRequired} />
      </TabsContent>
      {/* <TabsContent value="preferences">
        <PreferencesForm />
      </TabsContent> */}
    </Tabs>
  );
}