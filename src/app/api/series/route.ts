import { NextResponse } from "next/server";
import { query } from "../../lib/db";

export async function GET() {
  try {
    const series = await query(`SELECT * FROM ${process.env.DB_TABLE_NAME_SERIES}`);
    return NextResponse.json(series);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}