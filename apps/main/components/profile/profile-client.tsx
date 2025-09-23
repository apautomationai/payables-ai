"use client";

import React from "react";
import PersonalInformationForm from "./personal-information";
import SecurityForm from "./security-form";
import PreferencesForm from "./preferences-form";

// This is the main client component that organizes all the forms on the profile page.
export default function ProfileClient() {
  return (
    <div className="grid gap-6">
      <PersonalInformationForm />
      <SecurityForm />
      <PreferencesForm />
    </div>
  );
}
