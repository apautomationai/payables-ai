import Link from "next/link";
import { Bell, FileUp, History, Home, Package2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const navLinks = [
    { href: "#", icon: Home, label: "Dashboard", active: true },
    { href: "#", icon: FileUp, label: "PDF Process" },
    { href: "#", icon: History, label: "Processed History" },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className="hidden border-r bg-muted/40 md:flex md:flex-col transition-[width] duration-300 ease-in-out w-[220px] lg:w-[280px] data-[collapsed=true]:w-[60px] lg:data-[collapsed=true]:w-[60px]"
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            aria-label="PDF Extractor"
          >
            <Package2 className="h-6 w-6" />
            {!isCollapsed && <span className="">PDF Extractor</span>}
          </Link>
          {!isCollapsed && (
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <TooltipProvider delayDuration={0}>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((link) =>
                isCollapsed ? (
                  <Tooltip key={link.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                          link.active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                      link.active
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </TooltipProvider>
        </div>
        {!isCollapsed && (
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
