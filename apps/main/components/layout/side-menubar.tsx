"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Package2, // Used for the brand logo
  LogOut,
  Mail,
  User,
  Moon,
  Sun,
  PanelLeftClose, // Icon for collapse button
  PanelRightClose, // Icon for expand button
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { logoutAction } from "@/app/(auth)/logout/acttion";
import { cn } from "@workspace/ui/lib/utils";

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
  isCollapsed,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary font-semibold",
            isCollapsed && "justify-center"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className={cn("truncate", isCollapsed && "hidden")}>{children}</span>
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

export default function SideMenuBar({
  isCollapsed,
  onToggleCollapse,
  userName,
  userEmail,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col">
          {/* --- TOP HEADER WITH LOGO AND COLLAPSE BUTTON --- */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:h-[60px]">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 font-semibold",
                isCollapsed && "justify-center" // Center logo when collapsed if needed, but text hides
              )}
            >
              {/* Modern: Only use Package2 for the main logo */}
              <Package2 className="h-6 w-6" />
              <span className={cn(isCollapsed && "hidden")}>Payable.ai</span>
            </Link>
            {/* Collapse button is now a standalone element */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className={cn("h-8 w-8", isCollapsed && "mx-auto")} // Center button in collapsed state
            >
              {isCollapsed ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start gap-1 px-2 py-4 text-sm font-medium lg:px-4">
              <NavLink href="/dashboard" icon={LayoutDashboard} isActive={pathname === "/dashboard"} isCollapsed={isCollapsed}>
                Dashboard
              </NavLink>
              <NavLink href="/invoice-review" icon={FileText} isActive={pathname.startsWith("/invoice-review")} isCollapsed={isCollapsed}>
                Invoice Review
              </NavLink>
              <NavLink href="/settings" icon={Settings} isActive={pathname.startsWith("/settings")} isCollapsed={isCollapsed}>
                Settings
              </NavLink>
            </nav>
          </div>

          <div className="mt-auto border-t">
            <div className={cn("p-2", isCollapsed && "px-1 py-2")}>
              <Link
                href="mailto:support@payables.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-primary",
                  isCollapsed && "justify-center"
                )}
              >
                <Mail className="h-5 w-5" />
                <span className={cn(isCollapsed && "hidden")}>support@payables.dev</span>
              </Link>
            </div>

            <div className="border-t p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto p-2",
                      isCollapsed && "w-auto justify-center rounded-full p-2"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="https://..." alt={userName} />
                        <AvatarFallback>
                          <span suppressHydrationWarning>{userName.charAt(0)}</span>
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex flex-col items-start truncate", isCollapsed && "hidden")}>
                        <span className="text-sm font-semibold leading-tight">{userName}</span>
                        <span className="text-xs text-muted-foreground">{userEmail}</span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2 ml-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span>Toggle theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() =>
                      (document.getElementById('logout-form') as HTMLFormElement)?.requestSubmit()
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <form id="logout-form" action={logoutAction} className="hidden" />
    </>
  );
}