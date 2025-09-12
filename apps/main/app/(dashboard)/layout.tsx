"use client";

import React, { useState } from "react";
import SideMenuBar from "@/components/layout/side-menubar";
import Header from "@/components/layout/header";
import { cn } from "@workspace/ui/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed
          ? "md:grid-cols-[80px_1fr]"
          : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
      )}
    >
      <SideMenuBar isCollapsed={isCollapsed} />
      <div className="flex flex-col">
        <Header isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
