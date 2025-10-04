"use server";

import { revalidatePath } from "next/cache";
import client from "@/lib/fetch-client";

type ActionState =
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

export async function updateIntegrationStatusAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as UpdatePayload["name"];
  const status = formData.get("status") as UpdatePayload["status"];

  if (!name || !status) {
    return { error: "Missing integration name or status." };
  }

  try {
    if (status === "disconnected") {
      await client.delete(`api/v1/settings/integration?name=${name}`);
    } else {
      const payload = { name, status };
      await client.patch("api/v1/settings/update-status", payload);
    }

    revalidatePath("/settings");
    return { success: true, message: `Integration status updated to ${status}.` };
  } catch (error: any) {
    return { error: error.message || "Failed to update integration status." };
  }
}

export async function updateStartTimeAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const startTime = formData.get("startTime") as string;

  if (!name || !startTime) {
    return { error: "Missing integration name or start time." };
  }

  try {
    await client.patch("api/v1/settings/update-start", {
      startTime: startTime,
    });

    revalidatePath("/settings");
    return { success: true, message: "Start date saved successfully!" };
  } catch (error: any) {
    return { error: error.message || "Failed to update start time." };
  }
}