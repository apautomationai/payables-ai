import React, { useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/lib/axios-client";
import axios from "axios";
import { Button, ButtonProps } from "@workspace/ui/components/button";

export default function NewInvoiceButton({children, ...props}: ButtonProps & {children?: React.ReactNode}) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleFileUpload = async (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Invalid file type. Only PDF files are accepted.");
            return;
        }
        setIsUploading(true);
        const uploadToast = toast.loading("Preparing to upload...");
        try {
            const response = await client.get<{ signedUrl: string; publicUrl: string; key: string; }>(
                `/api/v1/upload/upload-attachment`,
                { params: { filename: file.name, mimetype: file.type } }
            );
            //@ts-ignore
            const { signedUrl, publicUrl, key } = response;
            if (!signedUrl || !publicUrl || !key) {
                throw new Error("Failed to retrieve valid upload details from the server.");
            }
            const uploadResponse = await axios.put(signedUrl, file, {
                headers: { "Content-Type": file.type },
                timeout: 60000,
            });
            if (uploadResponse.status !== 200) {
                throw new Error("File upload to storage failed.");
            }
            await client.post(`/api/v1/upload/create-record`, {
                filename: file.name,
                mimetype: file.type,
                fileUrl: publicUrl,
                fileKey: key,
            });
            toast.success("PDF uploaded and processed successfully!", { id: uploadToast });
            router.push("/invoice-review?tab=attachments");
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

    const handleButtonClick = () => {
        if (fileInputRef.current && !isUploading) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    return (
        <div className="flex items-center gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={onFileChange}
                disabled={isUploading}
            />
            <Button size="sm" className="cursor-pointer" onClick={handleButtonClick} disabled={isUploading} {...props}>
                {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    children ||<><Plus className="h-4 w-4 mr-2" /> <span>New Invoice</span></>
                )}
            </Button>
        </div>
    )
}