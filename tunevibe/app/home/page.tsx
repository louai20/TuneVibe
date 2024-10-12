"use client";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/NavBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePlaylistHandler } from "@/lib/playlistHandler";
import useStore from "@/store/useStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImportedPlaylists from "@/components/ImportedPlaylists";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function Home() {
    const { user, theme, setUser, toggleTheme } = useStore();
    const isLoggedIn = !!user;

    const [playlistUrl, setPlaylistUrl] = useState("");
    const { playlistData, isLoading, error, handleFetchPlaylist } =
        usePlaylistHandler(); // Destructure values from the custom hook
    // nextauth
    const { data: session, status } = useSession();

    

    const handleImportClick = () => {
        signIn("spotify");
        
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistUrl(e.target.value);
    };

    // const router = useRouter(); // Initialize useRouter

    // const extractPlaylistId = (url: string) => {
    //     const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    //     return match ? match[1] : null;
    // };

    // const handleAnalyze = async () => {
    //     const playlistId = extractPlaylistId(playlistUrl);
    //     if (playlistId) {
    //         try {
    //             handleFetchPlaylist(playlistUrl);
    //             router.push(`/analysis/${playlistId}`);
    //         } catch (error: any) {
    //             console.error("Error navigating to analysis page:", error);
    //             toast.error("An error occurred. Please try again.");
    //         }
    //     }
    // };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            <main className="container mx-auto px-4 py-8">
                <section className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Discover the Data of Your Music
                    </h2>
                    <p className="text-xl mb-8">
                        Analyze your playlists, understand your musical taste,
                        and explore new songs that match your mood.
                    </p>
                </section>

                <section className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center space-x-4 mb-4">
                            <div>
                                {status === "authenticated" ? (
                                    <Button
                                        className="flex items-center"
                                        type="button"
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                    >
                                        Imported from {session.user?.name}
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex items-center"
                                        // onClick={() => signIn("spotify")}
                                        onClick={handleImportClick}
                                        disabled={status === "loading"}
                                    >
                                        Import from Spotify
                                    </Button>
                                )}
                            </div>

                            <div className="flex-grow relative">
                                <Input
                                    type="text"
                                    value={playlistUrl}
                                    onChange={(e) =>
                                        setPlaylistUrl(e.target.value)
                                    }
                                    placeholder="OR Enter the URL of a specific playlist"
                                    className="flex-grow"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const url =
                                            e.dataTransfer.getData(
                                                "playlistUrl"
                                            );
                                        if (url) {
                                            setPlaylistUrl(url);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                        {session?.accessToken && <ImportedPlaylists />}
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => handleFetchPlaylist(playlistUrl)} // Use the handler from the custom hook
                            disabled={isLoading} // Disable button if loading
                        >
                            {isLoading ? "Loading..." : "Analyze Playlist"}
                        </Button>
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-2xl font-semibold mb-4 text-center">
                        How It Works
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-card text-card-foreground rounded-lg p-6">
                            <h4 className="font-semibold mb-2">
                                1. Connect Your Music
                            </h4>
                            <p>
                                Import your playlists from Spotify or enter a
                                playlist URL.
                            </p>
                        </div>
                        <div className="bg-card text-card-foreground rounded-lg p-6">
                            <h4 className="font-semibold mb-2">2. Analyze</h4>
                            <p>
                                Our service analyzes the audio features of your
                                music.
                            </p>
                        </div>
                        <div className="bg-card text-card-foreground rounded-lg p-6">
                            <h4 className="font-semibold mb-2">3. Discover</h4>
                            <p>
                                Get insights about your music taste and discover
                                new songs that match your mood.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
