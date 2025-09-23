import React from "react";
import SettingsClient from "@/components/settings/settings-clien";

// This is the main server component for the settings page.
// It sets up the main layout and renders the client component that handles interactivity.
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your platform configuration and integrations.
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}
