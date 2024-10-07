import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const playlistId = params.id;
        // Get Access Token
        const tokenParams = new URLSearchParams();
        tokenParams.append("grant_type", "client_credentials");
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            tokenParams.toString(),
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

        // get playlist data
        const playlistResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const playlistData = playlistResponse.data;
        // extract all tracks' ID
        const trackIds = playlistData.tracks.items
            .map((item: any) => item.track.id)
            .filter((id: string | null) => id !== null);
        // get audio features in batches (spotify api limite -- 100 ids maximum per request)
        const batches = [];
        for (let i = 0; i < trackIds.length; i += 100) {
            const batch = trackIds.slice(i, i + 100);
            batches.push(batch);
        }

        // map audio features to track IDs
        const audioFeaturesMap = new Map<string, any>();

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
            const audioFeaturesList = audioFeaturesResponse.data.audio_features;
            // Add each audio feature to the Map
            audioFeaturesList.forEach((feature: any) => {
                if (feature && feature.id) {
                    audioFeaturesMap.set(feature.id, feature);
                }
            });
        }
        // Add audio features to each track item
        const updatedItems = playlistData.tracks.items.map((item: any) => {
            const trackId = item.track.id;
            const audioFeatures = audioFeaturesMap.get(trackId) || null;
            return {
                ...item,
                audioFeatures,
            };
        });
        // update playlistData.tracks.items
        playlistData.tracks.items = updatedItems;
        return NextResponse.json(playlistData);
    } catch (error: any) {
        console.error(
            "Error fetching playlist data:",
            error.response?.data || error
        );
        return NextResponse.json(
            {
                error:
                    error.response?.data?.error?.message ||
                    "Failed to fetch playlist",
            },
            { status: error.response?.status || 500 }
        );
    }
}
//////////////////////////////////////////
// import { NextResponse } from 'next/server';
// import axios from 'axios';
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const playlistId = params.id;
//     // get Access Token
//     const tokenParams = new URLSearchParams();
//     tokenParams.append('grant_type', 'client_credentials');
//     const tokenResponse = await axios.post(
//       'https://accounts.spotify.com/api/token',
//       tokenParams.toString(),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization:
//             'Basic ' +
//             Buffer.from(
//               `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//             ).toString('base64'),
//         },
//       }
//     );
//     const accessToken = tokenResponse.data.access_token;
//     const playlistResponse = await axios.get(
//       `https://api.spotify.com/v1/playlists/${playlistId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     const playlistData = playlistResponse.data;
//     // extract all tracks' id
//     const trackIds = playlistData.tracks.items
//       .map((item: any) => item.track.id)
//       .filter((id: string | null) => id !== null);
//     // get audio features in batches (spotify api limite -- 100 ids maximum per request)
//     const batches = [];
//     for (let i = 0; i < trackIds.length; i += 100) {
//       const batch = trackIds.slice(i, i + 100);
//       batches.push(batch);
//     }
//     const audioFeatures: any[] = [];
//     for (const batch of batches) {
//       const ids = batch.join(',');
//       const audioFeaturesResponse = await axios.get(
//         `https://api.spotify.com/v1/audio-features`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           params: {
//             ids,
//           },
//         }
//       );
//       audioFeatures.push(...audioFeaturesResponse.data.audio_features);
//     }
//     const responseData = {
//       ...playlistData,
//       audioFeatures,
//     };
//     return NextResponse.json(responseData);
//   } catch (error: any) {
//     console.error('Error fetching playlist data:', error.response?.data || error);
//     return NextResponse.json(
//       { error: error.response?.data?.error?.message || 'Failed to fetch playlist' },
//       { status: error.response?.status || 500 }
//     );
//   }
// }