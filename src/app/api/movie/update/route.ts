import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Movie } from "../../../models/Movie";

export async function POST(request: Request) {
    const movie: Movie = await request.json();

    try {
        const result = await query(
            `UPDATE ${process.env.DB_TABLE_NAME} SET title = ?, year = ?, watched = ?, rating = ?, comments = ?, poster = ?, summary = ? WHERE id = ?`,
            [
                movie.title,
                movie.year,
                movie.watched ? 1 : 0,
                movie.rating,
                movie.comments,
                movie.poster,
                movie.summary,
                movie.id,
            ]
        );

        return NextResponse.json({ id: movie.id, ...movie });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
    }
}