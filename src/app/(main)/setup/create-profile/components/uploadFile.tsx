"use client";

import React, { useState } from "react";
import setPFP from "@/server/actions/set-pfp";
import deletePrevPFP from "@/server/actions/deleteprevPFP";

export default function UploadFile (cid: string | null) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (file) {
        await deletePrevPFP(cid);
      }
      setFile(e.target?.files?.[0] || null);
      if (!file) {
        return console.log("No file selected");
      }
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      await setPFP(url);
      setUploading(false);
    } catch (e) {
      console.log(e);
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
};

