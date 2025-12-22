import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { Series } from "../../../models/Series";

export async function POST(request: Request) {
    const series: Series = await request.json();

    try {
        const result = await query(
            `UPDATE ${process.env.DB_TABLE_NAME_SERIES} SET title = ?, year = ?, watched = ?, rating = ?, comments = ?, poster = ?, summary = ? WHERE id = ?`,
            [
                series.title,
                series.year,
                series.watched ? 1 : 0,
                series.rating,
                series.comments,
                series.poster,
                series.summary,
                series.id,
            ]
        );

        return NextResponse.json({ id: series.id, ...series });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
    }
}