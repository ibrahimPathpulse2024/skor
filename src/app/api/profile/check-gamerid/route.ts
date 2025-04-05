// app/api/profile/check-gamerid/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { nextauthOptions } from "../../../../config/next-auth";
import clientPromise from "../../../../lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gamerId = searchParams.get("gamerId");

  // Validate gamerId parameter
  if (!gamerId || typeof gamerId !== "string") {
    return NextResponse.json({ error: "Invalid Gamer ID" }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9]+$/.test(gamerId)) {
    return NextResponse.json(
      { error: "Gamer ID must be alphanumeric" },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(nextauthOptions);
    const client = await clientPromise;
    const db = client.db();

    // Build the query
    const query: any = { gamerId: gamerId };
    if (session?.user?.email) {
      query.email = { $ne: session.user.email };
    }

    const existingUser = await db.collection("users").findOne(query);

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Gamer ID check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
