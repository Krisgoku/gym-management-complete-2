"use client";

import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  currentImageUrl?: string;
}

export function UploadButton({
  onUploadComplete,
  onUploadError,
  currentImageUrl,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);

  return (
    <div className="space-y-4">
      <Avatar className="h-24 w-24 mx-auto">
        <AvatarImage src={previewUrl} />
        <AvatarFallback>
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            "Upload"
          )}
        </AvatarFallback>
      </Avatar>

      <UploadDropzone<OurFileRouter>
        endpoint="imageUploader"
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            setPreviewUrl(res[0].url);
            onUploadComplete(res[0].url);
          }
          setIsUploading(false);
        }}
        onUploadError={(error: Error) => {
          onUploadError(error);
          setIsUploading(false);
        }}
        appearance={{
          button: "bg-primary text-primary-foreground hover:bg-primary/90",
          container: "w-full border-2 border-dashed rounded-lg p-4",
          allowedContent: "text-xs text-muted-foreground",
        }}
        content={{
          button({ ready }) {
            if (!ready) return "Loading...";
            return "Upload Image";
          },
          allowedContent({ ready, fileTypes, isUploading }) {
            if (!ready) return "Loading...";
            if (isUploading) return "Uploading...";
            return "Images up to 4MB";
          },
        }}
      />
    </div>
  );
}