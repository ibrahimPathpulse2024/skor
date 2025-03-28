import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { nextauthOptions } from "../../../config/next-auth";
import clientPromise from "../../../lib/db";

export async function POST(req) {
  const session = await getServerSession(nextauthOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userSWA } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  try {
    await db
      .collection("users")
      .updateOne({ email: session.user?.email }, { $set: { userSWA } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update userSWA" },
      { status: 500 }
    );
  }
}
