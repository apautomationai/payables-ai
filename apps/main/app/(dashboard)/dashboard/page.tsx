import React from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";


// The component must be declared as 'async'
export default async function DashboardPage() {


  // Just pass the userId to the client component
  // The client component can fetch any additional data it needs
  return <DashboardClient userName="User"  />;
}