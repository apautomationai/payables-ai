"use client";

import React, { useEffect, useActionState } from "react";
import { toast } from "sonner";

import IntegrationsList from "./integrations-list";
import type { ActionState } from "@/app/(dashboard)/integrations/actions";

interface IntegrationData {
  name: string;
  status: string;
  startReading?: string | null;
  createdAt?: string | null;
  lastRead?: string | null;
}

const initialState: ActionState = undefined;

interface IntegrationsClientProps {
  integrations: IntegrationData[];
  updateAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  updateStartTimeAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}

export default function IntegrationsClient({
  integrations,
  updateAction,
  updateStartTimeAction,
}: IntegrationsClientProps) {
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
    <IntegrationsList
      integrations={integrations}
      updateAction={formAction}
      updateStartTimeAction={updateStartTimeAction}
    />
  );
}

