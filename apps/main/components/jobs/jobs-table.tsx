import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@workspace/ui/components/tooltip";

export interface Job {
    id: string;
    filename: string;
    sender: string;
    receiver: string;
    provider?: string;
    created_at: string;
    invoiceCount: number;
    jobStatus: "pending" | "processing" | "processed" | "approved" | "rejected" | "failed";
}

interface JobsTableProps {
    jobs: Job[];
    isLoading: boolean;
    onReviewJob: (jobId: string) => void;
}

export function JobsTable({ jobs, isLoading, onReviewJob }: JobsTableProps) {
    const getStatusBadge = (status: "pending" | "processing" | "processed" | "approved" | "rejected" | "failed") => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        Pending
                    </Badge>
                );
            case "processing":
                return (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        Processing
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Rejected
                    </Badge>
                );
            case "approved":
                return (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Approved
                    </Badge>
                );
            case "failed":
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Failed
                    </Badge>
                );
            case "processed":
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Processed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        Unknown
                    </Badge>
                );
        }
    };

    const getSourceDisplay = (provider?: string) => {
        if (provider === "gmail") return "Gmail";
        if (provider === "outlook") return "Outlook";
        return "—";
    };

    const getEmailDisplay = (provider?: string, receiver?: string) => {
        if (provider === "gmail" || provider === "outlook") {
            return receiver || "—";
        }
        return "—";
    };

    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px] max-w-[250px]">Job</TableHead>
                            <TableHead className="min-w-[150px]">Vendor</TableHead>
                            <TableHead className="min-w-[100px]">Source</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Received</TableHead>
                            <TableHead className="min-w-[80px]">Pages</TableHead>
                            <TableHead className="min-w-[120px]">Status</TableHead>
                            <TableHead className="text-right min-w-[140px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : jobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No jobs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium w-[250px] max-w-[250px]">
                                        <TooltipProvider delayDuration={300}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className="truncate cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onReviewJob(job.id);
                                                        }}
                                                    >
                                                        {job.filename}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="top"
                                                    className="max-w-[400px] break-words z-50"
                                                    sideOffset={5}
                                                >
                                                    {job.filename}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{job.sender || "—"}</TableCell>
                                    <TableCell>{getSourceDisplay(job.provider)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {getEmailDisplay(job.provider, job.receiver)}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(job.created_at).toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>{job.invoiceCount || 0}</TableCell>
                                    <TableCell>{getStatusBadge(job.jobStatus)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => onReviewJob(job.id)}
                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                                        >
                                            Open Mission
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
