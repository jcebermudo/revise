import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { getCurrentSession } from "@/server/session";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const userPFP = user.pfpCID;

    console.log("User CID:", userPFP);

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Delete old PFP if it exists
    if (userPFP) {
      try {
        await pinata.files.delete([userPFP]);
        console.log("Deleted old PFP:", userPFP);
      } catch (e) {
        console.error("Error deleting old PFP:", e);
        // Continue with upload even if delete fails
      }
    }

    const uploadData = await pinata.upload.file(file);
    if (!uploadData?.cid) {
      throw new Error("Upload failed - no CID returned");
    }

    const url = await pinata.gateways.createSignedURL({
      cid: uploadData.cid,
      expires: 3600,
    });

    if (!url) {
      throw new Error("Failed to create signed URL");
    }

    await db.update(userTable)
      .set({ pfpCID: uploadData.cid })
      .where(eq(userTable.id, userId));

    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.error("File upload error:", e);
    return NextResponse.json(
      { error: "Internal Server Error", details: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}