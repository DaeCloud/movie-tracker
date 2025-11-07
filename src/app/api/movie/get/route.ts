import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request: Request) {
  const { id } = await request.json();
  try {
    const movies = await query("SELECT * FROM movies WHERE id = ?", [id]);
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}