"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PlaylistCard from "./PlaylistCard";
import { Loader2 } from "lucide-react";

type Artist = {
    name: string;
};

type Track = {
    id: string;
    name: string;
    artists: Artist[];
    href: string;
    album: {
        images: { url: string }[];
    };
};

type Playlist = {
    id: string;
    name: string;
    description?: string;
    images?: { url: string }[];
    tracks: {
        href: string;
        total: number;
        items: Track[];
    };
    external_urls: { spotify: string };
};

export default function ImportedPlaylists() {
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const fetchPlaylists = async () => {
            setIsLoading(true);

            try {
                const response = await fetch("/api/userPlayList");
                if (!response.ok) {
                    throw new Error("Failed to fetch playlists");
                }

                const data = await response.json();

                if (isMounted) {
                    const playlistsWithTracks = await Promise.all(
                        data.items.map(async (playlist: Playlist) => {
                            if (!playlist.tracks) {
                                throw new Error("Tracks are undefined");
                            }

                            const tracksResponse = await fetch(
                                playlist.tracks.href,
                                {
                                    headers: {
                                        Authorization: `Bearer ${session?.accessToken}`,
                                    },
                                }
                            );

                            if (!tracksResponse.ok) {
                                throw new Error("Failed to fetch tracks");
                            }

                            const tracksData = await tracksResponse.json();

                            const uniqueTracks = Array.from(
                                new Set(
                                    tracksData.items.map(
                                        (track: any) => track.track.id
                                    )
                                )
                            ).map((id) => {
                                return tracksData.items.find(
                                    (track: any) => track.track.id === id
                                )?.track;
                            });

                            return {
                                ...playlist,
                                tracks: {
                                    href: playlist.tracks.href,
                                    total: tracksData.total,
                                    items: uniqueTracks.map((track: any) => ({
                                        id: track.id,
                                        name: track.name,
                                        artists: track.artists,
                                        album: track.album,
                                    })),
                                },
                            };
                        })
                    );

                    setPlaylists(playlistsWithTracks);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "An unknown error occurred"
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (session) {
            fetchPlaylists();
        }

        return () => {
            isMounted = false;
        };
    }, [session]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">Error: {error}</p>;
    }

    return (
        <div className="mb-12 px-4">
            <h2 className="text-2xl font-bold mb-6 text-black">
                Drop a playlist to URL Input
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    );
}
