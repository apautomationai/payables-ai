"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Package2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

const NavLink = ({
  href,
  icon: Icon,
  children,
  isCollapsed,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
  isActive: boolean;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary font-semibold"
          )}
        >
          <Icon className="h-5 w-5" />
          {!isCollapsed && <span className="truncate">{children}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" sideOffset={5}>
          {children}
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

export default function SideMenuBar({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className={cn(isCollapsed && "hidden")}>Payable.ai</span>
          </Link>
        </div>
        <div className="flex-1 py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink
              href="/dashboard"
              icon={LayoutDashboard}
              isCollapsed={isCollapsed}
              isActive={pathname === "/dashboard"}
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/dashboard/invoice-review"
              icon={FileText}
              isCollapsed={isCollapsed}
              isActive={pathname.startsWith("/dashboard/invoice-review")}
            >
              Invoice Review
            </NavLink>
            <NavLink
              href="/dashboard/settings"
              icon={Settings}
              isCollapsed={isCollapsed}
              isActive={pathname.startsWith("/dashboard/settings")}
            >
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
