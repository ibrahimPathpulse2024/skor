// app/api/profile/generate-gamerid/route.ts
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/db";

const generateRandomId = (length: number) => {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    let gamerId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      gamerId = generateRandomId(8);
      const existingUser = await db.collection("users").findOne({ gamerId });
      isUnique = !existingUser;
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: "Failed to generate unique Gamer ID" },
        { status: 500 }
      );
    }

    return NextResponse.json({ gamerId });
  } catch (error) {
    console.error("Gamer ID generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
