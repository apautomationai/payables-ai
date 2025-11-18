import React from "react";
import { Search, Plus, ArrowUpDown, RefreshCcw } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

interface JobsFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    onCreateJob: () => void;
    onSyncEmails: () => void;
    isSyncing: boolean;
    statusCounts?: {
        all: number;
        pending: number;
        processing: number;
        processed: number;
        approved: number;
        rejected: number;
        failed: number;
    };
}

export function JobsFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
    onCreateJob,
    onSyncEmails,
    isSyncing,
    statusCounts,
}: JobsFiltersProps) {
    const statusOptions = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "processed", label: "Processed" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "failed", label: "Failed" },
    ];

    return (
        <>
            {/* Status Pills and Actions */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Status Pills - Scrollable on mobile */}
                <div className="overflow-x-auto pb-2 -mx-2 px-2 flex-shrink min-w-0">
                    <div className="flex gap-2 min-w-max">
                        {statusOptions.map((status) => {
                            const count = statusCounts?.[status.value as keyof typeof statusCounts] ?? 0;
                            return (
                                <Button
                                    key={status.value}
                                    variant={statusFilter === status.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onStatusFilterChange(status.value)}
                                    className="rounded-full whitespace-nowrap"
                                >
                                    {status.label}
                                    {statusCounts && (
                                        <span className="ml-1.5 text-xs opacity-70">({count})</span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Actions - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="filename">Filename</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={onSyncEmails}
                            disabled={isSyncing}
                            className={cn("flex-1 sm:flex-none cursor-pointer", {
                                "opacity-50 cursor-not-allowed": isSyncing,
                            })}
                        >
                            {isSyncing ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 sm:mr-2 animate-spin" />
                                    <span className="hidden sm:inline text-sm">Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline text-sm">Sync</span>
                                </>
                            )}
                        </Button>
                        <Button onClick={onCreateJob} className="flex-1 sm:flex-none">
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Create Job</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search vendor, invoice, email..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>
        </>
    );
}
