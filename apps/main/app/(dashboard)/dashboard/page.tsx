import React from "react";
import { Users, Clock, DollarSign } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <p className="text-muted-foreground mt-2">
        Welcome back! Here's a summary of your invoice activity.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Invoices Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Invoices
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
        </div>

        {/* Pending Invoices Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Pending Review
            </h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 require attention</p>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Amount (Month)
            </h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </div>
        </div>
      </div>
      {/* More dashboard components like recent invoices table can be added below */}
    </div>
  );
}
