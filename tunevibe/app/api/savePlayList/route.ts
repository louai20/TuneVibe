// In your /app/api/savePlaylist/route.ts
import { NextResponse } from "next/server";
import { db } from "../../prisma/index";

export async function POST(req: Request) {
  try {
    const { name, url } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required." },
        { status: 400 }
      );
    }

    const newPlaylist = await db.playlist.create({
      data: {
        name,
        url,
      },
    });

    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (error) {
    console.error("Error saving playlist:", error);
    return NextResponse.json(
      { error: "Failed to save playlist." },
      { status: 500 }
    );
  }
}
