// import React from "react";
// import DashboardClient from "@/components/dashboard/dashboard-client";
// import client from "@/lib/fetch-client";
// import { User, Attachment, ApiResponse } from "@/lib/types";

// // Define a more specific type for the attachments response payload
// interface AttachmentsPayload {
//   attachments: Attachment[];
//   pagination: {
//     totalAttachments: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// export default async function DashboardPage() {
//   let userName = "User";
//   let attachments: Attachment[] = [];
//   let integrationError: string | null = null;

//   try {
//     const [userResult, attachmentsResult] = await Promise.allSettled([
//       client.get<ApiResponse<User>>("api/v1/users/me"),
//       // Updated to expect the more specific payload type
//       client.get<ApiResponse<AttachmentsPayload>>("api/v1/google/attachments"),
//     ]);

//     if (userResult.status === "fulfilled" && userResult.value?.data) {
//       const user = userResult.value.data;
//       userName = `${user.firstName} ${user.lastName}`.trim();
//     } else if (userResult.status === "rejected") {
//       // User fetch rejection logic remains the same
//       const errorReason = userResult.reason as any;
//       const errorMessage =
//         errorReason?.error?.message && typeof errorReason.error.message === "string"
//           ? errorReason.error.message
//           : "";

//       if (errorMessage.includes("No integrations found for this user")) {
//         integrationError = "Connect Email in Settings";
//       } else {
//         console.error("Failed to fetch user data:", userResult.reason);
//       }
//     }

//     if (attachmentsResult.status === "fulfilled" && attachmentsResult.value?.data?.attachments) {
//       // --- FIX: Correctly access the nested 'attachments' array ---
//       attachments = attachmentsResult.value.data.attachments;
//     } else if (attachmentsResult.status === "rejected") {
//       // Attachments fetch rejection logic remains the same
//       const errorReason = attachmentsResult.reason as any;
//       const errorMessage =
//         errorReason?.error?.message && typeof errorReason.error.message === "string"
//           ? errorReason.error.message
//           : "";
      
//       if (errorMessage.includes("No integrations found for this user")) {
//         integrationError = "Connect Email in Settings";
//       } else {
//         // console.error("Failed to fetch attachments:", attachmentsResult.reason);
//       }
//     }
//   } catch (error) {
//     console.error("An unexpected error occurred while fetching dashboard data:", error);
//   }

//   return <DashboardClient userName={userName} attachments={attachments} integrationError={integrationError} />;
// }



import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import client from "@/lib/fetch-client";
import { User, InvoiceListItem, ApiResponse } from "@/lib/types";

// Define the payload type for the invoices list response
interface InvoicesPayload {
  invoices: InvoiceListItem[];
  pagination: {
    totalInvoices: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default async function DashboardPage() {
  let userName = "User";
  let invoices: InvoiceListItem[] = [];
  let integrationError: string | null = null;

  try {
    const [userResult, invoicesResult] = await Promise.allSettled([
      client.get<ApiResponse<User>>("api/v1/users/me"),
      // Fetch from the new invoice list endpoint
      client.get<ApiResponse<InvoicesPayload>>("api/v1/invoice/invoices?limit=10"),
    ]);

    if (userResult.status === "fulfilled" && userResult.value?.data) {
      const user = userResult.value.data;
      userName = `${user.firstName} ${user.lastName}`.trim();
    } else if (userResult.status === "rejected") {
      const errorReason = userResult.reason as any;
      const errorMessage =
        errorReason?.error?.message && typeof errorReason.error.message === "string"
          ? errorReason.error.message
          : "";

      if (errorMessage.includes("No integrations found for this user")) {
        integrationError = "Connect Email in Settings";
      } else {
        console.error("Failed to fetch user data:", userResult.reason);
      }
    }

    if (invoicesResult.status === "fulfilled" && invoicesResult.value?.data?.invoices) {
      // Correctly access the nested 'invoices' array
      invoices = invoicesResult.value.data.invoices;
    } else if (invoicesResult.status === "rejected") {
      const errorReason = invoicesResult.reason as any;
      const errorMessage =
        errorReason?.error?.message && typeof errorReason.error.message === "string"
          ? errorReason.error.message
          : "";
      
      if (errorMessage.includes("No integrations found for this user")) {
        integrationError = "Connect Email in Settings";
      } else {
        // console.error("Failed to fetch invoices:", invoicesResult.reason);
      }
    }
  } catch (error) {
    console.error("An unexpected error occurred while fetching dashboard data:", error);
  }

  return <DashboardClient userName={userName} invoices={invoices} integrationError={integrationError} />;
}