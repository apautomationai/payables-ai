"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ["/sign-in", "/sign-up"];
  const isAuthPage = authRoutes.includes(pathname);

  // State is now managed here
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // If it's an auth page, render children without the dashboard shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render the full dashboard layout
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex flex-col">
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
