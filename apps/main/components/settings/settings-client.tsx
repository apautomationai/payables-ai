"use client";

import React, { useEffect, useActionState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import IntegrationsTab from "./integrations-settings";

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
    <Tabs defaultValue="integrations">
      <TabsList>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="integrations">
        <IntegrationsTab
          integrations={integrations}
          //@ts-ignore
          updateAction={formAction}
          updateStartTimeAction={updateStartTimeAction}
        />
      </TabsContent>
    </Tabs>
  );
}