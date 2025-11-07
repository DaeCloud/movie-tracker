import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Movie } from "../../../models/Movie";

export async function POST(request: Request) {
    const movie: Movie = await request.json();
    try {
        const result = await query(
            "INSERT INTO movies (id, title, year, watched, rating, comments, poster, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                movie.id,
                movie.title,
                movie.year,
                movie.watched,
                movie.rating,
                movie.comments,
                movie.poster,
                movie.summary,
            ]
        );
        return NextResponse.json({ id: result.insertId, ...movie });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
    }
}