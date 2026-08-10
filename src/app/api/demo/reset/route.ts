import { NextResponse } from "next/server";
import { resetDatabase } from "@/lib/dbInit";

export async function POST() {
  const result = await resetDatabase();
  if (result.success) {
    return NextResponse.json({ success: true, message: "Database reset to initial mock data" });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
