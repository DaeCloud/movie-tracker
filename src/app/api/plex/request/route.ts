import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    console.log(`Making Plex request for movie ID: ${id}`);

    const body = {
      theMovieDbId: id,
      is4kRequest: false,
      requestOnBehalf: process.env.REQUEST_ON_BEHALF || '',
      rootFolderOverride: 0,
      qualityPathOverride: 0,
    };

    console.log("Request body for Plex request:", body);

    const response = await fetch(`${process.env.OMBI_BASE_URL}/api/v1/Request/movie`, {
      method: "POST",
      headers: {
        "ApiKey": process.env.OMBI_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text(); // read the raw response
    console.log(`Ombi response status: ${response.status} ${response.statusText}`);
    console.log("Ombi response body:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to make request: ${response.status} ${response.statusText} — Body: ${responseText}`
      );
    }

    // parse JSON only if status is OK
    const data = JSON.parse(responseText);
    console.log(`Successfully requested movie ID ${id}:`, data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error making Plex request:", error);
    return NextResponse.json(
      { error: "Failed to make Plex request", details: (error as Error).message },
      { status: 500 }
    );
  }
}
