import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Movie } from "../../../models/Movie";

export async function POST(request: Request) {
    const movie: Movie = await request.json();

    const omdbResult = await fetch("http://www.omdbapi.com/?i=tt1375666&apikey="+process.env.OMDB_API_KEY);

    try {
        const result = await query(
            "INSERT INTO movies (id, title, year, watched, rating, comments, poster, summary, critic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                movie.id,
                movie.title,
                movie.year,
                movie.watched,
                movie.rating,
                movie.comments,
                movie.poster,
                movie.summary,
                omdbResult.Ratings.filter(r => r.Source == "Rotten Tomatoes")[0].Value,
            ]
        );
        return NextResponse.json({ id: result.insertId, ...movie });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
    }
}