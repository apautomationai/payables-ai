import { Attachment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { UploadCloud } from "lucide-react";

interface AttachmentViewerProps {
  selectedAttachment: Attachment | null;
}

export default function AttachmentViewer({ selectedAttachment }: AttachmentViewerProps) {
  return (
    <Card className="flex-1 flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          Invoice Attachment
        </CardTitle>
        {selectedAttachment && (
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-mono">
            ID: {selectedAttachment.id.substring(0, 12)}...
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0">
        {selectedAttachment ? (
          <iframe
            src={selectedAttachment.s3Url}
            className="w-full h-full border-0"
            title="Invoice Preview"
          />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <UploadCloud className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">Select an invoice to preview its attachment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}