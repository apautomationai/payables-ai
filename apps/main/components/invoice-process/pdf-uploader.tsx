
"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface PdfUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function PdfUploader({ onFileUpload, isUploading }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    event.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileUpload(file);
    } else {
      console.error("Invalid file type. Please upload a PDF.");
    }
  };

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-200",
        isDragging && !isUploading
          ? "border-primary bg-primary/10"
          : "border-border",
        isUploading
          ? "cursor-not-allowed bg-muted/50 opacity-60"
          : "cursor-pointer hover:border-primary/50"
      )}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <>
          <Loader2 className="w-10 h-10 text-muted-foreground mb-2 animate-spin" />
          <p className="font-semibold text-sm">Uploading...</p>
          <p className="text-xs text-muted-foreground">Please wait</p>
        </>
      ) : (
        <>
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="font-semibold text-sm">Drag & drop a PDF here</p>
          <p className="text-xs text-muted-foreground">or click to select a file</p>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
        id="pdf-upload"
        aria-label="Upload PDF file"
        title="Select a PDF file to upload"
        disabled={isUploading}
      />
      <label 
        htmlFor="pdf-upload" 
        className="sr-only"
      >
        Upload PDF file
      </label>
    </div>
  );
}