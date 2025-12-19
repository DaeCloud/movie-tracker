import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function POST(request: Request) {
  
  try {
    const movies = await query(`SELECT * FROM ${process.env.DB_TABLE_NAME}`);

    let updated = []

    for (let i = 0; i < movies.length; i++){
      if(movies[i].backdrop == null){
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${movies[i].id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.TMDB_TOKEN}`
          }
        });

        const json = await resp.json();

        if(json.backdrop_path != null){
          const backdropURL = `https://image.tmdb.org/t/p/original${json.backdrop_path}`;

          const updateSql = await query(`UPDATE ${process.env.DB_TABLE_NAME} SET backdrop = ? WHERE id = ?`,
            [
              backdropURL,
              movies[i].id
            ]
          )

          updated.push({
            title: movies[i].title,
            backdrop: backdropURL
          })
        }
      }
    }

    return NextResponse.json({updated});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update backdrops" }, { status: 500 });
  }
}