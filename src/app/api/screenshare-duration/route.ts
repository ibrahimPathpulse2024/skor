import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { nextauthOptions } from "../../../config/next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(nextauthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { duration } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID!;
    const sheetName = "Sheet2";

    // Get current data from the sheet
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:C`,
    });

    const values = getResponse.data.values || [];

    const userEmail = session.user.email!;
    const userName = session.user.name!;
    const existingRowIndex = values.findIndex((row) => row[0] === userEmail);

    if (existingRowIndex !== -1) {
      // Existing user – update duration
      const existingDuration = parseInt(values[existingRowIndex][2]) || 0;
      const newDuration = existingDuration + duration;

      const rowNumber = existingRowIndex + 2; // A2 is row 2
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowNumber}:C${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[userEmail, userName, newDuration]],
        },
      });
    } else {
      // New user – append row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A2`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[userEmail, userName, duration]],
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error logging screen share duration:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}