import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Series } from "../../../models/Series";

export async function POST(request: Request) {
    const series: Series = await request.json();


    try {
        const result = await query(
            `INSERT INTO ${process.env.DB_TABLE_NAME_SERIES} (id, title, year, watched, rating, comments, poster, summary, backdrop) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                series.id,
                series.title,
                series.year,
                series.watched,
                series.rating,
                series.comments,
                series.poster,
                series.summary,
                series.backdrop,
            ]
        );
        return NextResponse.json({ id: result.insertId, ...series });
    } catch (error) {
        console.error(error);
        if (error.code && error.code === "ER_DUP_ENTRY") {
            return NextResponse.json({ error: "Series already exists" }, { status: 409 });
        }
        
        return NextResponse.json({ error: "Failed to add series", code: error.code, message: error.message }, { status: 500 });
    }
}