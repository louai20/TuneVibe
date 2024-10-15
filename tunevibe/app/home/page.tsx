"use client";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/NavBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePlaylistHandler } from "@/lib/playlistHandler";
import useStore from "@/store/useStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImportedPlaylists from "@/components/ImportedPlaylists";
import FloatingShapes from "@/components/FloatingShapes";

export default function Home() {
    const { user, theme, setUser, toggleTheme } = useStore();
    const isLoggedIn = !!user;

    const [playlistUrl, setPlaylistUrl] = useState("");
    const { playlistData, isLoading, error, handleFetchPlaylist, clearError } =
        usePlaylistHandler(); // Destructure values from the custom hook
    // nextauth
    const { data: session, status } = useSession();

    const handleImportClick = () => {
        signIn("spotify");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistUrl(e.target.value);
        clearError(); // Clear the error when the input changes
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden animate-fade-slide-in">
            <NavBar />
            <FloatingShapes />

            <main className="container mx-auto px-4 py-16 z-50 relative">
                <section className="max-w-4xl mb-4 mx-auto animate-fade-slide-in">
                    <h2 className="text-4xl font-bold mb-4">
                        Discover the Data of Your Music
                    </h2>
                    <p className="text-lg max-w-[20rem] text-pretty animate-fade-slide-in-delay">
                        Analyze your playlists, understand your musical taste,
                        and explore new songs that match your mood.
                    </p>
                </section>

                <section className="mb-24 max-w-4xl mx-auto space-y-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <Input
                                type="text"
                                value={playlistUrl}
                                onChange={handleInputChange}
                                placeholder="Enter the URL of a specific playlist"
                                className="flex-grow"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const url =
                                        e.dataTransfer.getData("playlistUrl");
                                    if (url) {
                                        setPlaylistUrl(url);
                                        clearError(); // Clear the error when a playlist is dropped
                                    }
                                }}
                            />
                            {status !== "authenticated" && (
                                <span className="text-sm">Or</span>
                            )}
                            <div>
                                {status === "authenticated" ? (
                                    <Button
                                        className="flex items-center bg-[#1DB954] hover:bg-[#1ed760] text-white"
                                        type="button"
                                        disabled={true}
                                    >
                                        <span className="icon-[mdi--spotify] mr-2 text-xl"></span>
                                        Imported from {session.user?.name}
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex items-center bg-[#1DB954] hover:bg-[#1ed760] text-white"
                                        onClick={handleImportClick}
                                        disabled={status === "loading"}
                                    >
                                        <span className="icon-[mdi--spotify] mr-2 text-xl"></span>
                                        Import from Spotify
                                    </Button>
                                )}
                            </div>
                            <Button
                                className="self-end"
                                onClick={() => handleFetchPlaylist(playlistUrl)}
                                disabled={isLoading || !playlistUrl}
                            >
                                {isLoading ? "Loading..." : "Analyze Playlist"}
                            </Button>
                        </div>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <div>{session?.accessToken && <ImportedPlaylists />}</div>
                </section>
                <section className="mb-12 grid grid-cols-12 gap-4 max-w-4xl mx-auto">
                    <Card className="col-span-12 md:col-span-4">
                        <CardHeader>
                            <CardTitle>How It Works</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-balance ">
                                Our platform takes your music experience to the
                                next level by offering seamless integration with
                                your playlists, advanced analysis of your
                                favorite tracks, and personalized
                                recommendations. Whether you're curious about
                                your music taste or eager to discover new tunes,
                                our service has you covered.
                            </p>
                        </CardContent>
                    </Card>
                    <div className="grid md:grid-cols-2 gap-4 col-span-12 md:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    1. Connect Your Music
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Import your playlists from Spotify or enter
                                    a playlist URL.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    2. Analyze
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Our service analyzes the audio features of
                                    your music.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    3. Discover
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Get insights about your music taste and
                                    discover new songs that match your mood.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    4. Share
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Share your music insights and discoveries
                                    with your friend!
                                </p>
                            </CardContent>
                        </Card>
                        {/* </div>
<h3 className="text-2xl font-semibold mb-4 text-center col-span-12">
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
                        </div> */}
                    </div>
                </section>
            </main>
        </div>
    );
}
