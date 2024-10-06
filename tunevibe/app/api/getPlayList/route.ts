import { NextResponse } from "next/server";
import { db } from "../../prisma/index";

export async function GET() {
  try {
    const lastPlaylist = await db.playlist.findFirst({
      orderBy: {
        createdAt: "desc", // Order by creation date in descending order
      },
    });

    if (!lastPlaylist) {
      return NextResponse.json(
        { error: "No playlists found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lastPlaylist, { status: 200 });
  } catch (error) {
    console.error("[GET LAST PLAYLIST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
