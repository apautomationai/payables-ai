"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import PlatformSettingsForm from "./platform-settings";
import IntegrationsTab from "./integrations-settings";

// This is the main client component that manages the state for the tabs.
export default function SettingsClient() {
  return (
    <Tabs defaultValue="platform">
      <TabsList>
        <TabsTrigger value="platform">Platform Settings</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="platform">
        <PlatformSettingsForm />
      </TabsContent>
      <TabsContent value="integrations">
        <IntegrationsTab />
      </TabsContent>
    </Tabs>
  );
}
