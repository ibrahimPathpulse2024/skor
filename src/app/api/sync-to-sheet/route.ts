// app/api/sync-to-sheet/route.ts
import { google } from "googleapis";
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/db";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection("users").find({}).toArray();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values = users.map((user) => [user.email, user.name, user.gamerId]);

    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A2:Z",
    });

    // 5. Update sheet with new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${users.length} users to sheet`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
