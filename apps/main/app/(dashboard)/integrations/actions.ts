"use server";

import { revalidatePath } from "next/cache";
import client from "@/lib/fetch-client";

export type ActionState =
  | {
      success?: boolean;
      error?: string;
      message?: string;
    }
  | undefined;

interface UpdatePayload {
  name: "gmail" | "outlook" | "quickbooks";
  status: "success" | "disconnected" | "failed" | "not_connected" | "paused";
}

/**
 * Handles status updates like Pause, Resume, and Disconnect.
 * It triggers a revalidation of the '/integrations' path to refresh data.
 */
export async function updateIntegrationStatusAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name") as UpdatePayload["name"];
  const status = formData.get("status") as UpdatePayload["status"];

  if (!name || !status) {
    return { error: "Missing integration name or status." };
  }

  try {
    if (status === "disconnected") {
      // Handle QuickBooks disconnect with specific endpoint
      if (name === "quickbooks") {
        await client.delete("api/v1/quickbooks/disconnect");
      } else {
        // Handle other integrations with generic endpoint
        await client.delete(`api/v1/settings/integration?name=${name}`);
      }
      revalidatePath("/integrations");
      return {
        success: true,
        message: "Integration disconnected successfully.",
      };
    } else {
      const payload = { name, status };
      await client.patch("api/v1/settings/update-status", payload);
      revalidatePath("/integrations");
      return {
        success: true,
        message: `Integration status updated to ${status}.`,
      };
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update integration status.";
    return { error: errorMessage };
  }
}

/**
 * Handles saving the start date for an integration.
 */
export async function updateStartTimeAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const startReading = formData.get("startReading") as string;

  console.log("name from action", name);
  if (!name || !startReading) {
    return { error: "Missing integration name or start time." };
  }
  console.log("startReading from action", startReading);

  try {
    await client.patch("api/v1/settings/update-start", {
      startReading: startReading,
    });

    revalidatePath("/integrations");
    return { success: true, message: "Start date saved successfully!" };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update start time.";
    return { error: errorMessage };
  }
}

