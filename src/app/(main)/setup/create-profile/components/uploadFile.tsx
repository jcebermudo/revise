"use client";

import React, { useState } from "react";
import setPFP from "@/server/actions/set-pfp";

export default function UploadFile() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target?.files?.[0];
      if (!selectedFile) {
        return console.log("No file selected");
      }
      setUploading(true);

      const data = new FormData();
      data.set("file", selectedFile); // Use selectedFile instead of file state

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      if (!uploadRequest.ok) {
        throw new Error(`Upload failed with status: ${uploadRequest.status}`);
      }

      const signedUrl = await uploadRequest.json();

      // Only call setPFP after we have the signed URL
      if (signedUrl) {
        await setPFP(signedUrl);
      }

      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center">
      <input
        type="file"
        onChange={uploadFile}
        id="fileInput"
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        {uploading ? "Uploading..." : "Upload your photo"}
      </label>
    </main>
  );
}
