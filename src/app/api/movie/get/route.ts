import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request: Request) {
  const { id } = await request.json();
  try {
    const movies = await query(`SELECT * FROM ${process.env.DB_TABLE_NAME} WHERE id = ?`, [id]);
    return NextResponse.json(movies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}