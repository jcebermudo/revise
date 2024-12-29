import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentSession } from "@/server/session";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await getCurrentSession();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
        // Save the file to your database
        await db.update(userTable).set({ profilePicture: file.url }).where(eq(userTable.id, metadata.userId));

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
