import { NextResponse } from "next/server";
import { Movie } from "../../../models/Movie";
import { query } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const { search } = await request.json();
    const url = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    };

    const res = await fetch(url, options);
    const json = await res.json();

    const dbRes = await query(`SELECT * FROM ${process.env.DB_TABLE_NAME}`);

    function alreadyAdded(id){
      return dbRes.filter(m => m.id == id).length == 0 ? false : true;
    }

    let output: Movie[] = json.results.map((item: any) => ({
      id: item.id,
      title: item.title,
      year: item.release_date ? item.release_date.substring(0, 4) : null,
      watched: 0,
      rating: null,
      comments: null,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      summary: item.overview,
      backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      added: alreadyAdded(item.id)
    }));

    console.table(output);
    return NextResponse.json(output);
  } catch (err) {
    console.error("Error fetching movies:", err);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
