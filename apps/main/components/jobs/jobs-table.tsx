import React, { useState } from "react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { client } from "@/lib/axios-client";
import { toast } from "sonner";

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
    onJobDeleted?: () => void;
}

export function JobsTable({ jobs, isLoading, onReviewJob, onJobDeleted }: JobsTableProps) {
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; jobId?: string; filename?: string }>({ open: false });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent, jobId: string, filename: string) => {
        e.stopPropagation();
        setDeleteDialog({ open: true, jobId, filename });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.jobId) return;

        setIsDeleting(true);
        try {
            await client.delete(`/api/v1/google/attachments/${deleteDialog.jobId}`);
            toast.success("Job deleted successfully");
            setDeleteDialog({ open: false });

            // Notify parent to refresh the list
            if (onJobDeleted) {
                onJobDeleted();
            }
        } catch (error) {
            console.error("Failed to delete job:", error);
            toast.error("Failed to delete job");
        } finally {
            setIsDeleting(false);
        }
    };
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
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => onReviewJob(job.id)}
                                                disabled={job.invoiceCount === 0}
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Open Job
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => handleDeleteClick(e, job.id, job.filename)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this job? This will also delete all associated invoices and cannot be undone.
                            {deleteDialog.filename && (
                                <div className="mt-2 text-sm font-medium">
                                    <strong>Job:</strong> {deleteDialog.filename}
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
