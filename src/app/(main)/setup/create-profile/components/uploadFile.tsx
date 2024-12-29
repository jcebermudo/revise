"use client";

import { UploadButton } from "@/utils/uploadthing";
import { twMerge } from "tailwind-merge";
import setPFP from "@/server/actions/set-pfp";

export default function UploadPFP() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        className="ut-label:hidden"
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          console.log("Files: ", res);
          await setPFP(res[0].url);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        config={{ cn: twMerge }}
        appearance={{
          button: "bg-white text-black",
          allowedContent: "hidden",
        }}
      />
    </main>
  );
}
