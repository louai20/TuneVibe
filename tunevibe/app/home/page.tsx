"use client";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CloudIcon,
    DownloadIcon,
    ShareIcon,
    UserIcon,
    HeartIcon,
} from "lucide-react";
import NavBar from "@/NavBar";
import { signIn, signOut, useSession } from "next-auth/react";
import MoodChart from "@/mood-chart/page";
import { usePlaylistHandler } from "@/lib/playlistHandler";
import BubbleChart from "@/components/BubbleChart";
import useStore from "@/store/useStore";
import { toast } from "react-hot-toast";
// import { fetchPlaylist, PlaylistData } from "@/utils/fetchPlaylist";
// import { PlaylistAudioFeatures } from "@/utils/types";

// Assume we have a WordCloud component
// const WordCloud = ({ words }: { words: string[] }) => (
//     <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
//         <CloudIcon className="w-12 h-12 text-muted-foreground" />
//         <span className="ml-2 text-muted-foreground">
//             Word Cloud Placeholder
//         </span>
//     </div>
// );

export default function Home() {
    // This would be populated with actual data in a real application
    const sampleWords = [
        "love",
        "heartbreak",
        "dance",
        "party",
        "sad",
        "happy",
    ];
    const sampleTracks = [
        { title: "Happy", artist: "Pharrell Williams", mood: "Joyful" },
        { title: "Someone Like You", artist: "Adele", mood: "Melancholic" },
        {
            title: "Uptown Funk",
            artist: "Mark Ronson ft. Bruno Mars",
            mood: "Energetic",
        },
    ];

    const { user, theme, setUser, toggleTheme } = useStore();
    const isLoggedIn = !!user;

    const [playlistUrl, setPlaylistUrl] = useState("");
    const { playlistData, isLoading, error, handleFetchPlaylist } =
        usePlaylistHandler(); // Destructure values from the custom hook
    // nextauth
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [isSaved, setIsSaved] = useState(false);

    // Fetch playlists on component mount
    useEffect(() => {
        // Update loading state based on session status
        if (status !== "loading") {
            setLoading(false);
        }
    }, [status]); // Re-run this effect when the session status changes

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (status === "authenticated") {
                // Check if the user is authenticated
                const response = await fetch("/api/getPlayList"); // Replace with your actual endpoint
                const data = await response.json();

                if (response.ok) {
                    handleFetchPlaylist(data.url); // Set the playlist URL from the fetched data
                } else {
                    console.error(data.error); // Handle error appropriately
                }
            } else {
                console.log("User is not logged in."); // Log or handle the case when the user is not authenticated
            }
        };

        if (!loading) {
            fetchPlaylists(); // Only fetch playlists if loading is false
        }
    }, [loading, status]); // Include loading and status in the dependency array

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    const handleSave = () => {
        if (user) {
            setIsSaved(!isSaved);
            toast(
                isSaved
                    ? "Playlist removed from favorites. You can add it back anytime."
                    : "Playlist saved to favorites. You can find it in your profile.",
                { duration: 3000 }
            );
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            <main className="container mx-auto px-4 py-8">
                {
                    <>
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Import or Select Music
                            </h2>
                            <div className="flex space-x-4 mb-4">
                                <div>
                                    {status === "authenticated" ? (
                                        <Button
                                            className="flex items-center"
                                            type="button"
                                            onClick={() =>
                                                signOut({ callbackUrl: "/" })
                                            }
                                        >
                                            Imported from {session.user?.name}{" "}
                                            <br /> Sign out
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex items-center"
                                            onClick={() => signIn("spotify")}
                                            disabled={status === "loading"}
                                        >
                                            Import from Spotify
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    type="text"
                                    value={playlistUrl}
                                    onChange={(e) =>
                                        setPlaylistUrl(e.target.value)
                                    }
                                    placeholder="OR Enter the URL of a specific playlist"
                                    className="flex-grow"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    className="flex items-center"
                                    onClick={() =>
                                        handleFetchPlaylist(playlistUrl)
                                    } // Use the handler from the custom hook
                                    disabled={isLoading} // Disable button if loading
                                >
                                    {isLoading ? "Loading..." : "Analyse"}
                                </Button>
                            </div>
                            {error && (
                                <p className="text-red-500 mt-4">{error}</p>
                            )}{" "}
                            {/* Show error if exists */}
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Mood and Lyrics Analysis
                            </h2>
                            <Tabs defaultValue="moodchart">
                                <TabsList>
                                    <TabsTrigger value="moodchart">
                                        Mood Chart
                                    </TabsTrigger>
                                    <TabsTrigger value="bubblechart">
                                        Bubble Chart
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="moodchart">
                                    {
                                        <div className="h-full bg-muted rounded-lg items-center p-5">
                                            {playlistData === null ? (
                                                <h2 className="text-center text-xl font-semibold m-4">
                                                    :)
                                                </h2>
                                            ) : (
                                                <MoodChart
                                                    data={playlistData}
                                                />
                                            )}
                                        </div>
                                    }
                                </TabsContent>
                                <TabsContent value="bubblechart">
                                    <div className="h-full bg-muted rounded-lg items-center p-5">
                                        {playlistData === null ? (
                                            <h2 className="text-center text-xl font-semibold m-4">
                                                :)
                                            </h2>
                                        ) : (
                                            <BubbleChart
                                                data={playlistData.tracks.items}
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Analysis Results
                            </h2>
                            <div className="bg-card text-card-foreground rounded-lg p-4">
                                <p className="mb-2">
                                    Overall Mood: Energetic and Upbeat
                                </p>
                                <p className="mb-2">
                                    Dominant Themes: Love, Celebration,
                                    Friendship
                                </p>
                                <p>
                                    Top Keywords: Dance, Party, Together, Night,
                                    Fun
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Share and Download
                            </h2>
                            <div className="flex space-x-4">
                                <Button className="flex items-center">
                                    <ShareIcon className="mr-2 h-4 w-4" />
                                    Share Analysis
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex items-center"
                                >
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download Results
                                </Button>
                                <Button
                                    variant={isSaved ? "default" : "outline"}
                                    className="flex items-center"
                                    onClick={handleSave}
                                >
                                    <HeartIcon
                                        className={`mr-2 h-4 w-4 ${
                                            isSaved ? "fill-current" : ""
                                        }`}
                                    />
                                    {isSaved ? "Saved" : "Save Playlist"}
                                </Button>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Discover Similar Music
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sampleTracks.map((track, index) => (
                                    <div
                                        key={index}
                                        className="bg-card text-card-foreground rounded-lg p-4"
                                    >
                                        <h3 className="font-semibold">
                                            {track.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {track.artist}
                                        </p>
                                        <p className="text-sm mt-2">
                                            Mood: {track.mood}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                    // )
                }
            </main>
        </div>
    );
}
