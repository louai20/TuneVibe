"use client";

import NavBar from "@/NavBar";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MusicIcon, BarChart2Icon, UserIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

// This would typically come from an API or database
const userData = {
    name: "Alice Johnson",
    email: "alice@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
};

interface SavedPlaylist {
    id: string;
    name: string;
    spotifyId: string;
    jsonData: any;
    createdAt: Date;
    updatedAt: Date;
}

const analysisResults = [
    {
        id: 1,
        name: "Summer Vibes 2023",
        date: "2023-06-15",
        mood: "Upbeat",
        topThemes: ["Joy", "Energy", "Romance"],
    },
    {
        id: 2,
        name: "Workout Mix",
        date: "2023-05-20",
        mood: "Energetic",
        topThemes: ["Motivation", "Power", "Rhythm"],
    },
    {
        id: 3,
        name: "Chill Evening",
        date: "2023-06-01",
        mood: "Relaxed",
        topThemes: ["Calm", "Introspection", "Melody"],
    },
];

export default function UserAccount() {
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    // const [profile, setProfile] = useState<ProfileData | null>(null);
    const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);

    const handleDeletePlaylist = async (spotifyId: string) => {
        if (!confirm("Are you sure you want to delete this playlist?")) {
            return;
        }

        try {
            const response = await fetch("/api/userSavedPlaylists", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spotifyId }),
            });

            if (response.ok) {
                toast.success("Playlist deleted successfully!");
                window.location.reload();

                // setProfile((prev) =>
                //     prev
                //         ? {
                //               ...prev,
                //               savedPlaylists: prev.savedPlaylists.filter(
                //                   (pl) => pl.spotifyId !== spotifyId
                //               ),
                //           }
                //         : prev
                // );
            } else {
                const errorData = await response.json();
                toast.error(
                    `Delete failed: ${errorData.message || "Unknown error"}`
                );
            }
        } catch (error) {
            console.error("Error deleting playlist:", error);
            toast.error(
                "An error occurred during the delete process. Please try again later."
            );
        }
    };

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await fetch("/api/userSavedPlaylists");
                if (!res.ok) {
                    throw new Error("Failed to fetch playlists.");
                }
                const data = await res.json();
                setSavedPlaylists(data.savedPlaylists);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                    <Tabs defaultValue="playlists">
                        <TabsList className="mb-4">
                            <TabsTrigger value="playlists">
                                My Playlists
                            </TabsTrigger>
                            <TabsTrigger value="analysis">
                                Analysis History
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="playlists">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Playlists</CardTitle>
                                    <CardDescription>
                                        View and manage your saved playlists
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {savedPlaylists.map((playlist) => (
                                            <div
                                                key={playlist.id}
                                                className="flex items-center justify-between p-4 bg-muted rounded-lg"
                                            >
                                                <Link
                                                    href={`/profile/${encodeURIComponent(
                                                        playlist.spotifyId
                                                    )}/audio-features`}
                                                    className="flex items-center space-x-4"
                                                >
                                                    {playlist.jsonData.images &&
                                                    playlist.jsonData.images
                                                        .length > 0 ? (
                                                        <img
                                                            src={
                                                                playlist
                                                                    .jsonData
                                                                    .images
                                                                    .length > 2
                                                                    ? playlist
                                                                          .jsonData
                                                                          .images[2]
                                                                          .url
                                                                    : playlist
                                                                          .jsonData
                                                                          .images[
                                                                          playlist
                                                                              .jsonData
                                                                              .images
                                                                              .length -
                                                                              1
                                                                      ].url
                                                            }
                                                            alt="Playlist Image"
                                                            className="w-8 h-8"
                                                        />
                                                    ) : (
                                                        <MusicIcon className="w-8 h-8 text-primary" />
                                                    )}

                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {playlist.name}
                                                        </h3>
                                                    </div>
                                                </Link>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDeletePlaylist(
                                                                playlist.spotifyId
                                                            )
                                                        }
                                                        aria-label="Delete Playlist"
                                                    >
                                                        <Trash2Icon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                {/* <div className="text-sm text-muted-foreground">
                                                    Last analyzed:
                                                    {playlist.updatedAt.toISOString()}
                                                </div> */}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="analysis">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Analysis History</CardTitle>
                                    <CardDescription>
                                        Review your past mood analysis results
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {analysisResults.map((result) => (
                                            <div
                                                key={result.id}
                                                className="p-4 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold">
                                                        {result.name}
                                                    </h3>
                                                    <span className="text-sm text-muted-foreground">
                                                        {result.date}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <BarChart2Icon className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">
                                                        Overall Mood:{" "}
                                                        {result.mood}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.topThemes.map(
                                                        (theme, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full"
                                                            >
                                                                {theme}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
