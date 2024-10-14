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
import { useSession } from "next-auth/react";
import FloatingShapes from "@/components/FloatingShapes";

interface SavedPlaylist {
    id: string;
    name: string;
    spotifyId: string;
    jsonData: any;
    createdAt: Date;
    updatedAt: Date;
}

export default function UserAccount() {
    const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredPlaylists = savedPlaylists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

    const { data: session, status } = useSession();
    if (status === "loading") {
        return <p>Loading...</p>;
    }
    if (!session) {
        return <p>Access Denied. You need to be logged in.</p>;
    }
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            <NavBar />
            <FloatingShapes />
            <div className="container mx-auto px-4 py-8 relative z-20">
                <div className="grid gap-8 md:grid-cols-[auto_300px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Playlists</CardTitle>
                            <CardDescription>
                                View and manage your saved playlists
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="text"
                                placeholder="Search playlists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-4 p-2 border rounded"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredPlaylists.map((playlist) => (
                                    <div
                                        key={playlist.id}
                                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                                    >
                                        <Link
                                            href={`/analysis/${encodeURIComponent(
                                                playlist.spotifyId
                                            )}`}
                                            className="flex items-center space-x-4"
                                        >
                                            {playlist.jsonData.images &&
                                            playlist.jsonData.images.length >
                                                0 ? (
                                                <img
                                                    src={
                                                        playlist.jsonData.images
                                                            .length > 2
                                                            ? playlist.jsonData
                                                                  .images[2].url
                                                            : playlist.jsonData
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
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>My Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-start space-y-4">
                                <p>Name: {session.user?.name}</p>
                                <p>Email: {session.user?.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        
    );
}
