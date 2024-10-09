"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePlaylistHandler } from "@/lib/playlistHandler";

interface AudioFeature {
    id: string;
    name: string;
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
}

// interface Track {
//     id: string;
//     name: string;
//     audio_features: AudioFeature;
// }

// interface PlaylistDetails {
//     id: string;
//     name: string;
//     spotifyId: string;
//     image?: string;
//     jsonData: {
//         tracks: Track[];
//     };
//     createdAt: string;
//     updatedAt: string;
// }

export default function AudioFeaturesPage() {
    const { spotifyId } = useParams();
    const [playlist, setPlaylist] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const res = await fetch(
                    `/api/userSavedPlaylists?spotifyId=${encodeURIComponent(
                        spotifyId as string
                    )}`,
                    {
                        method: "GET",
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || "Failed to fetch playlist details."
                    );
                }

                const data: JSON = await res.json();
                setPlaylist(data);
            } catch (err: any) {
                console.error("Error fetching playlist details:", err);
                setError(err.message);
                toast.error(
                    `Unable to obtain playlist details: ${err.message}`
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [spotifyId]);

    if (loading) {
        return (
            <div>
                <NavBar />
                <div className="flex justify-center items-center h-screen">
                    <Loader2Icon className="animate-spin w-8 h-8 text-primary" />
                </div>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div>
                <NavBar />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-500">
                        Unable to load playlist details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{playlist.name} - Audio Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border rounded-lg">
                                    <Table className="min-w-full divide-y divide-gray-200">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="sticky left-0 z-10 bg-background">
                                                    Track Name
                                                </TableHead>
                                                <TableHead>
                                                    Danceability
                                                </TableHead>
                                                <TableHead>Energy</TableHead>
                                                <TableHead>Loudness</TableHead>
                                                <TableHead>
                                                    Speechiness
                                                </TableHead>
                                                <TableHead>
                                                    Acousticness
                                                </TableHead>
                                                <TableHead>
                                                    Instrumentalness
                                                </TableHead>
                                                <TableHead>Liveness</TableHead>
                                                <TableHead>Valence</TableHead>
                                                <TableHead>Tempo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {playlist.jsonData.tracks.items.map(
                                                (item: any) => (
                                                    <TableRow
                                                        key={item.track.id}
                                                    >
                                                        <TableCell className="sticky left-0 z-10 bg-background">
                                                            {item.track.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.danceability.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.energy.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.loudness.toFixed(
                                                                2
                                                            )}{" "}
                                                            dB
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.speechiness.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.acousticness.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.instrumentalness.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.liveness.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.valence.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.audioFeatures.tempo.toFixed(
                                                                2
                                                            )}{" "}
                                                            BPM
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
