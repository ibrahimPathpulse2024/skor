// app/api/profile/update/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { nextauthOptions } from "../../../../config/next-auth";
import clientPromise from "../../../../lib/db";

const updateSchema = z.object({
  name: z.string().min(2).max(50),
  gamerId: z.string().min(4).max(20),
  image: z.string().url().optional(),
});

export async function PATCH(req: Request) {
  const client = await clientPromise;
  const db = client.db();

  const session = await getServerSession(nextauthOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const updatedUser = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: validation.data.name,
          gamerId: validation.data.gamerId,
          image: validation.data.image,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        gamerId: updatedUser.gamerId,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
