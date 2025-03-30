import { NextResponse } from "next/server";
import { getDb } from "../../../../database";

export async function GET() {
  try {
    const db = await getDb();
    const portfolio = await db.all("SELECT * FROM portfolio");
    return NextResponse.json(portfolio, { status: 200 });
  } catch (error) {
    console.error("Error in GET portfolio route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}