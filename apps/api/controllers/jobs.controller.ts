import { Request, Response } from "express";
import { BadRequestError } from "@/helpers/errors";
import { googleServices } from "@/services/google.services";
import { invoiceServices } from "@/services/invoice.services";

class JobsController {
    async getJobs(req: Request, res: Response) {
        try {
            //@ts-ignore
            const userId = req.user.id;

            if (!userId) {
                throw new BadRequestError("Need a valid userId");
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const statusFilter = (req.query.status as string) || "all";
            const sortBy = (req.query.sortBy as string) || "newest";
            const searchQuery = (req.query.search as string) || "";

            // Get attachments (jobs)
            const attachmentsData = await googleServices.getAttachments(
                userId,
                page,
                limit
            );

            //@ts-ignore
            const attachments = attachmentsData.attachments || [];

            // For each attachment, get associated invoices and calculate status
            let jobsWithStatus = await Promise.all(
                attachments.map(async (attachment: any) => {
                    try {
                        // Get invoices for this attachment
                        const invoices = await invoiceServices.getInvoicesByAttachmentId(
                            attachment.id
                        );

                        // Calculate job status based on attachment status and invoice statuses
                        let jobStatus: "pending" | "processing" | "processed" | "approved" | "rejected" | "failed" = "pending";
                        const invoiceCount = invoices.length;

                        // Check attachment status first
                        if (attachment.status === "pending") {
                            jobStatus = "pending";
                        } else if (attachment.status === "processing") {
                            jobStatus = "processing";
                        } else if (attachment.status === "failed") {
                            jobStatus = "failed";
                        } else if (attachment.status === "success" || attachment.status === "completed") {
                            // Attachment processed successfully, now check invoice statuses
                            if (invoiceCount > 0) {
                                const statuses = invoices.map((inv: any) => inv.status);
                                const allApproved = statuses.every((s: string) => s === "approved");
                                const allRejected = statuses.every((s: string) => s === "rejected");
                                const hasFailed = statuses.some((s: string) => s === "failed");

                                if (hasFailed) {
                                    jobStatus = "failed";
                                } else if (allApproved) {
                                    jobStatus = "approved";
                                } else if (allRejected) {
                                    jobStatus = "rejected";
                                } else {
                                    jobStatus = "processed";
                                }
                            } else {
                                // No invoices yet, but attachment is processed
                                jobStatus = "processed";
                            }
                        } else {
                            // Default to processed for any other status
                            jobStatus = "processed";
                        }

                        return {
                            ...attachment,
                            invoiceCount,
                            jobStatus,
                        };
                    } catch (error) {
                        console.error(`Failed to fetch invoices for attachment ${attachment.id}:`, error);
                        return {
                            ...attachment,
                            invoiceCount: 0,
                            jobStatus: "pending" as const,
                        };
                    }
                })
            );

            // Calculate status counts before filtering
            const statusCounts = {
                all: jobsWithStatus.length,
                pending: jobsWithStatus.filter((j: any) => j.jobStatus === "pending").length,
                processing: jobsWithStatus.filter((j: any) => j.jobStatus === "processing").length,
                processed: jobsWithStatus.filter((j: any) => j.jobStatus === "processed").length,
                approved: jobsWithStatus.filter((j: any) => j.jobStatus === "approved").length,
                rejected: jobsWithStatus.filter((j: any) => j.jobStatus === "rejected").length,
                failed: jobsWithStatus.filter((j: any) => j.jobStatus === "failed").length,
            };

            // Apply status filter
            if (statusFilter !== "all") {
                jobsWithStatus = jobsWithStatus.filter((job: any) => job.jobStatus === statusFilter);
            }

            // Apply search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                jobsWithStatus = jobsWithStatus.filter((job: any) => {
                    return (
                        job.filename.toLowerCase().includes(searchLower) ||
                        job.sender.toLowerCase().includes(searchLower) ||
                        job.receiver.toLowerCase().includes(searchLower)
                    );
                });
            }

            // Apply sorting
            jobsWithStatus.sort((a: any, b: any) => {
                if (sortBy === "newest") {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else if (sortBy === "oldest") {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                } else if (sortBy === "filename") {
                    return a.filename.localeCompare(b.filename);
                }
                return 0;
            });

            const result = {
                status: "success",
                data: {
                    jobs: jobsWithStatus,
                    statusCounts,
                    pagination: {
                        //@ts-ignore
                        totalJobs: attachmentsData.totalAttachments || 0,
                        page,
                        limit,
                        //@ts-ignore
                        totalPages: Math.ceil((attachmentsData.totalAttachments || 0) / limit),
                    },
                },
            };

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || "Failed to get jobs",
            });
        }
    }
}

export const jobsController = new JobsController();
