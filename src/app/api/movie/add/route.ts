import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Movie } from "../../../models/Movie";

export async function POST(request: Request) {
    const movie: Movie = await request.json();

    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids`, {
        method: "GET",
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
    });

    const json = await res.json();
    const imdbId = json["imdb_id"];

    const omdbResult = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`);
    const omdbJson = await omdbResult.json();

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
                omdbJson.Ratings.filter(r => r.Source == "Rotten Tomatoes")[0].Value,
            ]
        );
        return NextResponse.json({ id: result.insertId, ...movie });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
    }
}