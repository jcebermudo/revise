import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config"
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
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file)
    await db.update(userTable).set({pfpCID: uploadData.cid}).where(eq(userTable.id, userId));
    const url = await pinata.gateways.createSignedURL({
     	cid: uploadData.cid,
     	expires: 3600,
  	});
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
