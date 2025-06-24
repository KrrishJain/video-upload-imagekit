"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";

interface fileUplaodProps {
  onSuccess: (res: any) => void;
  onProgress?: (progess: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: fileUplaodProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if(!file || !validateFile(file)) return

    setUploading(true)
    setError(null)

    try {
        const authRes = await fetch("/api/auth/imagekit-auth")
        const auth = await authRes.json()
        console.log("auht credeint",auth)

       const res = await upload({
                file,
                fileName: file.name, 
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.authenticationParameter.signature,
                expire: auth.authenticationParameter.expire,
                token: auth.authenticationParameter.token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100
                        onProgress(Math.round(percent))
                    }
                },
        })

        onSuccess(res)
        console.log("upload success", res);
        
    } catch (error) {
        console.error("Uplaod failed", error);
        
    }finally{
        setUploading(false)
    }

  }

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Loading...</span>}
    </>
  );
};

export default FileUpload;
