import React from "react";
import ProfileClient from "@/components/profile/profile-client";

// This is the main server component for the profile page.
// It sets up the main layout and renders the client component that handles interactivity.
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <ProfileClient />
    </div>
  );
}
