"use client";

import React, { useEffect, useActionState } from "react";
import { toast } from "sonner";

import Integrations from "./integrations-settings";

type ActionState = {
  success?: boolean;
  error?: string;
  message?: string;
} | undefined;

const initialState: ActionState = undefined;

interface SettingsClientProps {
  integrations: any[];
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

export default function SettingsClient({
  integrations,
  updateAction,
  updateStartTimeAction,
}: SettingsClientProps) {
  const [state, formAction] = useActionState(updateAction, initialState);

  useEffect(() => {
    if (!state) return;

    if (state.error) {
      toast.error("An error occurred", {
        description: state.error,
      });
    } else if (state.success) {
      toast.success(state.message || "Action successful!");
    }
  }, [state]);

  return (
    <Integrations
    integrations={integrations}
    updateAction={formAction}
    updateStartTimeAction={updateStartTimeAction}
  />
  );
}