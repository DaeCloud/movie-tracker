import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        const response = await fetch(`${process.env.OMBI_BASE_URL}/api/v2/Search/movie/${id}`, {
            method: "GET",
            headers: {
                "ApiKey": process.env.OMBI_API_KEY || "",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Ombi data: ${response.statusText}`);
        }

        const data = await response.json();

        console.log(`Movie ID ${id} availability:`, data.available);

        return NextResponse.json({ availability: data.available, requested: data.requested });
    } catch (error) {
        console.error("Error fetching Ombi availability:", error);
        return NextResponse.json({ error: "Failed to check Ombi availability" }, { status: 500 });
    }
}
