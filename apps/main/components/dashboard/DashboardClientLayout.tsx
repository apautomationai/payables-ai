"use client";

import React, { useState, ReactNode } from "react";
import SideMenuBar from "@/components/layout/side-menubar";
import Footer from "@/components/layout/footer";
import { cn } from "@workspace/ui/lib/utils";

interface DashboardClientLayoutProps {
  userName: string;
  userEmail: string;
  children: ReactNode;
}

export default function DashboardClientLayout({
  userName,
  userEmail,
  children,
}: DashboardClientLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed ? "md:grid-cols-[72px_1fr]" : "md:grid-cols-[280px_1fr]"
      )}
    >
      <SideMenuBar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}