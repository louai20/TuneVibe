import axios from "axios";
import { AudioFeatures, PlaylistAudioFeatures } from "./types";

export interface PlaylistData {
    name: string;
    description: string;
    tracks: {
        items: {
            track: {
                id: string;
                name: string;
                artists: {
                    name: string;
                }[];
                [key: string]: any;
            };
        }[];
    };
    [key: string]: any;
}

export const fetchPlaylist = async (
    playlistId: string
): Promise<PlaylistAudioFeatures> => {
    try {
        // const tokenResponse = await axios.get("/api/token");
        // const accessToken = tokenResponse.data.access_token;

        // const playlistResponse = await axios.get(
        //     `https://api.spotify.com/v1/playlists/${playlistId}`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //         },
        //     }
        // );

        // get Access Token
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            params.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                        ).toString("base64"),
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const playlistResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const playlistData: PlaylistData = playlistResponse.data;

        // extract all tracks' ids
        const trackIds = playlistData.tracks.items
            .map((item) => item.track.id)
            .filter((id) => id !== null);

        // Spotify API limit -- 100 ids maximum per request
        const batches = [];
        for (let i = 0; i < trackIds.length; i += 100) {
            const batch = trackIds.slice(i, i + 100);
            batches.push(batch);
        }

        const audioFeatures: AudioFeatures[] = [];

        for (const batch of batches) {
            const ids = batch.join(",");
            const audioFeaturesResponse = await axios.get(
                `https://api.spotify.com/v1/audio-features`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        ids,
                    },
                }
            );

            audioFeatures.push(...audioFeaturesResponse.data.audio_features);
        }

        return {
            ...playlistData,
            audioFeatures,
        };
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error?.message || "Failed to fetch playlist"
        );
    }
};
