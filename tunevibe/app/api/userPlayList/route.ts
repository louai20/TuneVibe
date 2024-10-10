import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// Define the expected structure of the playlists response
interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    // Add other properties as needed
}

interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[];
}

export async function GET(req: NextRequest) {
    // Get session data to check authentication
    const session = await getServerSession(authOptions);

    // Validate session and access token
    if (!session || !session.accessToken) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    const accessToken = session.accessToken as string;

    try {
        // Fetch the user's playlists from Spotify
        const response = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Check for a successful response
        if (!response.ok) {
            const errorBody = await response.json(); // Log the error response body
            console.error("Spotify API error response:", errorBody);
            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        const playlists: SpotifyPlaylistsResponse = await response.json();

        return NextResponse.json(playlists, { status: 200 });
    } catch (error: any) {
        if (error.response && error.response.status === 429) {
            console.error("Too Many Requests:", error.message);
            const retryAfter = error.response.headers["retry-after"];
            if (retryAfter) {
                setTimeout(() => {
                    // 
                }, parseInt(retryAfter) * 1000); 
            }
        } else {
            console.error("Error fetching data:", error);
        }

        return NextResponse.json(
            { error: "Failed to fetch playlists" },
            { status: 500 }
        );
    }
}
