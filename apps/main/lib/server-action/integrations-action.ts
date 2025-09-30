// /app/actions/integrations-actions.ts 

"use server";

import { revalidatePath } from "next/cache"; 
import client from "@/lib/fetch-client"; 

// NOTE: No longer need to import 'cookies' here

// Define the expected payload structure
interface UpdatePayload {
    name: 'gmail' | 'outlook' | 'quickbooks';
    status: 'success' | 'disconnected' | 'failed' | 'not_connected' | 'paused';
}

export async function updateIntegrationStatusAction(prevState: any, formData: FormData) {
  
  const name = formData.get('name') as UpdatePayload['name'];
  const newStatus = formData.get('status') as UpdatePayload['status'];
  
  if (!name || !newStatus) {
    return { error: "Missing integration name or status." };
  }
  
  const payload: UpdatePayload = {
    name: name,
    status: newStatus,
  };
  
  try {
    // The `client.patch` method doesn't need auth options passed to it.
    // Since this is a server action, the `fetch-client` will automatically
    // read the auth cookies and add the correct headers.
    await client.patch('api/v1/settings/update-status', payload); 

    revalidatePath('/settings'); 

    return { success: true };
  } catch (error) {
    console.error("Failed to update status in server action:", error);
    return { error: "Failed to update integration status. Check API or Auth." };
  }
}