// "use client";

// import React from "react";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@workspace/ui/components/tabs";
// import PlatformSettingsForm from "./platform-settings";
// import IntegrationsTab from "./integrations-settings";
// import BillingTab from "./billing"; // Import the new component

// interface SettingsClientProps {
//     integrations: any[];
// }
// // This is the main client component that manages the state for the tabs.
// export default function SettingsClient({integrations}: SettingsClientProps) {
//   return (
//     <Tabs defaultValue="integrations">
//       <TabsList>
//         {/* <TabsTrigger value="platform">Platform Settings</TabsTrigger> */}
//         <TabsTrigger value="integrations">Integrations</TabsTrigger>
//         {/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
//       </TabsList>
//       <TabsContent value="platform">
//         <PlatformSettingsForm />
//       </TabsContent>
//       <TabsContent value="integrations">
//         <IntegrationsTab integrations={integrations}/>
//       </TabsContent>
//       <TabsContent value="billing">
//         <BillingTab />
//       </TabsContent>
//     </Tabs>
//   );
// }

"use client";

import React, { useEffect, useState, useActionState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import PlatformSettingsForm from "./platform-settings";
import IntegrationsTab from "./integrations-settings";
import BillingTab from "./billing";

// Define a type for our action's state
type ActionState = {
  success?: boolean;
  error?: string;
} | undefined;

// The initial state before any action
const initialState: ActionState = undefined;

interface SettingsClientProps {
  integrations: any[];
  // The action prop now expects a function compatible with useActionState
  updateAction: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

export default function SettingsClient({
  integrations,
  updateAction,
}: SettingsClientProps) {
  // useActionState now manages the state returned from the server action
  const [state, formAction] = useActionState(updateAction, initialState);

  // State to control the dialog's visibility and content
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // This effect runs when the server action completes and opens the dialog
  useEffect(() => {
    // Ignore the initial state on render
    if (!state) return;

    if (state.error) {
      setDialog({
        isOpen: true,
        title: "Error",
        message: state.error,
      });
    } else if (state.success) {
      setDialog({
        isOpen: true,
        title: "Success",
        message: "Integration status updated successfully!",
      });
    }
  }, [state]);

  return (
    <>
      <Tabs defaultValue="integrations">
        <TabsList>
          {/* <TabsTrigger value="platform">Platform Settings</TabsTrigger> */}
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
        </TabsList>
        <TabsContent value="platform">
          <PlatformSettingsForm />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsTab
            integrations={integrations}
            // @ts-ignore
            updateAction={formAction} // Pass the action handled by the hook
          />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
      </Tabs>

      {/* This Dialog provides immediate feedback from the Server Action */}
      <Dialog
        open={dialog.isOpen}
        onOpenChange={(isOpen) => setDialog((prev) => ({ ...prev, isOpen }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogDescription>{dialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}