"use client";

import React, { useState } from "react";
import SideMenuBar from "@/components/layout/side-menubar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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
        isCollapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[240px_1fr]"
      )}
    >
      <SideMenuBar isCollapsed={isCollapsed} />
      
      <div className="flex flex-col max-h-screen overflow-hidden">
        <Header isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        
        <Footer />
      </div>
    </div>
  );
}