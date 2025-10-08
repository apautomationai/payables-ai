// "use client";

// import React from "react";
// import { Attachment } from "@/lib/types";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
// import { Badge } from "@workspace/ui/components/badge";

// // Helper component for displaying each detail field
// const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
//   <div>
//     <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
//     <p className="font-semibold text-primary mt-1 truncate">
//       {value}
//     </p>
//   </div>
// );

// interface InvoiceDetailsProps {
//   attachment: Attachment | null;
// }

// export default function InvoiceDetails({ attachment }: InvoiceDetailsProps) {
//   if (!attachment) {
//     return (
//       <Card className="flex items-center justify-center h-full min-h-[400px]">
//         <div className="text-center">
//           <p className="text-lg font-semibold">No Invoice Selected</p>
//           <p className="text-muted-foreground mt-1">Please select an invoice from the list to see its details.</p>
//         </div>
//       </Card>
//     );
//   }

//   // --- MODIFICATION: Using static demo data for fields as requested ---
//   return (
//     <Card className="h-[400px]">
//       <CardHeader>
//         <CardTitle className="truncate" title={attachment.filename}>
//           {attachment.filename}
//         </CardTitle>
//         <CardDescription>
//           Attachment Details
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-4">
//         <div className="grid grid-cols-2 gap-y-6 gap-x-8">
//           {/* Dynamic ID is used for Invoice Number */}
//           <DetailItem label="Invoice Number" value={attachment.id} />
          
//           {/* Static Demo Data */}
//           <DetailItem label="Vendor" value="Unknown Vendor" />
//           <DetailItem label="Customer" value="No Customer" />
//           <DetailItem label="Cost Code" value="No Cost Code" />
//           <DetailItem label="Rate" value="$0.00" />
//           <DetailItem label="Quantity" value="0" />
//           <DetailItem label="Total" value="$3,480.97" />
          
//           <div>
//             <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
//             <div className="mt-1">
//               <Badge
//                 variant="outline"
//                 className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-none font-semibold"
//               >
//                 Pending
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import React from "react";
import { InvoiceDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="font-semibold text-primary mt-1 truncate">
      {value ?? "N/A"}
    </p>
  </div>
);

const DetailItemSkeleton = () => (
  <div>
    <Skeleton className="h-3 w-16 mb-2" />
    <Skeleton className="h-5 w-full" />
  </div>
)

interface InvoiceDetailsComponentProps {
  invoice: InvoiceDetails | null;
  isLoading: boolean;
}

export default function InvoiceDetailsComponent({ invoice, isLoading }: InvoiceDetailsComponentProps) {
  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-2 gap-y-6 gap-x-8">
          {[...Array(8)].map((_, i) => <DetailItemSkeleton key={i} />)}
        </CardContent>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold">No Invoice Selected</p>
          <p className="text-muted-foreground mt-1">Please select an invoice from the list to see its details.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="truncate" title={invoice.invoiceNumber}>
          Invoice #{invoice.invoiceNumber}
        </CardTitle>
        <CardDescription>
          Invoice Details
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
          <DetailItem label="Invoice Number" value={invoice.invoiceNumber} />
          <DetailItem label="Vendor" value={invoice.vendorName} />
          <DetailItem label="Customer" value={invoice.customerName} />
          <DetailItem label="Cost Code" value={invoice.costCode} />
          <DetailItem label="Rate" value={invoice.rate} />
          <DetailItem label="Quantity" value={invoice.quantity} />
          <DetailItem label="Total" value={invoice.totalAmount} />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <div className="mt-1">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-none font-semibold capitalize"
              >
                {invoice.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}