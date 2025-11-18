"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { client } from "@/lib/axios-client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import PdfUploader from "@/components/invoice-process/pdf-uploader";

interface CreateJobDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onJobCreated?: () => void;
}

export function CreateJobDialog({ open, onOpenChange, onJobCreated }: CreateJobDialogProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Invalid file type. Only PDF files are accepted.");
            return;
        }

        setIsUploading(true);
        const uploadToast = toast.loading("Preparing to upload...");

        try {
            // Step 1: Get signed URL for upload
            const response = await client.get<{
                signedUrl: string;
                publicUrl: string;
                key: string;
            }>(`/api/v1/upload/upload-attachment`, {
                params: { filename: file.name, mimetype: file.type },
            });

            //@ts-ignore
            const { signedUrl, publicUrl, key } = response;

            if (!signedUrl || !publicUrl || !key) {
                throw new Error("Failed to retrieve valid upload details from the server.");
            }

            // Step 2: Upload file to S3
            const uploadResponse = await axios.put(signedUrl, file, {
                headers: { "Content-Type": file.type },
                timeout: 60000,
            });

            if (uploadResponse.status !== 200) {
                throw new Error("File upload to storage failed.");
            }

            // Step 3: Create attachment record
            await client.post("/api/v1/upload/create-record", {
                filename: file.name,
                mimetype: file.type,
                fileUrl: publicUrl,
                fileKey: key,
            });

            toast.success("Job created successfully!", { id: uploadToast });

            // Close dialog and refresh
            onOpenChange(false);
            if (onJobCreated) {
                onJobCreated();
            }
            router.refresh();
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred during upload.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage, { id: uploadToast });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Job</DialogTitle>
                    <DialogDescription>
                        Upload a PDF invoice to create a new job. The file will be processed automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <PdfUploader onFileUpload={handleFileUpload} isUploading={isUploading} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
