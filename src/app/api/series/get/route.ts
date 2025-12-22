import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request: Request) {
  const { id } = await request.json();
  try {
    const series = await query(`SELECT * FROM ${process.env.DB_TABLE_NAME_SERIES} WHERE id = ?`, [id]);
    return NextResponse.json(series);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}