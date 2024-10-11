"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { usePlaylistHandler } from "@/lib/playlistHandler";
import MoodChart from "@/mood-chart/page";
import BubbleChart from "@/components/BubbleChart";
import describePlaylist from "@/utils/describePlaylist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon, ShareIcon, DownloadIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import useStore from "@/store/useStore";
import NavBar from "@/NavBar";
import { useSession } from "next-auth/react";
import { pageDebug } from "@/utils/debugger";

export default function AnalysisPage() {
    const { spotifyId } = useParams();
    const { user, theme, setUser, toggleTheme } = useStore();
    const isLoggedIn = !!user;

    const [playlistUrl, setPlaylistUrl] = useState("");
    const { playlistData, isLoading, error, handleFetchPlaylist } =
        usePlaylistHandler(); // Destructure values from the custom hook
    // nextauth
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(true); // Initialize loading state
    const [isSaved, setIsSaved] = useState(false);

    const { openAuthModal, closeAuthModal } = useStore();

    useEffect(() => {
        if (spotifyId) {
            const playlistUrl = `https://open.spotify.com/playlist/${spotifyId}`;
            handleFetchPlaylist(playlistUrl);
        }
    }, [spotifyId]);

    // Fetch playlists on component mount
    useEffect(() => {
        // Update loading state based on session status
        if (status !== "loading") {
            setLoading(false);
        }
    }, [status]); // Re-run this effect when the session status changes

    // useEffect(() => {
    //     const fetchPlaylists = async () => {
    //         if (status === "authenticated") {
    //             // Check if the user is authenticated
    //             const response = await fetch("/api/getPlayList"); // Replace with your actual endpoint
    //             const data = await response.json();

    //             if (response.ok) {
    //                 handleFetchPlaylist(data.url); // Set the playlist URL from the fetched data
    //             } else {
    //                 console.error(data.error); // Handle error appropriately
    //             }
    //         } else {
    //             console.log("User is not logged in."); // Log or handle the case when the user is not authenticated
    //         }
    //     };

    //     if (!loading) {
    //         fetchPlaylists(); // Only fetch playlists if loading is false
    //     }
    // }, [loading, status]); // Include loading and status in the dependency array

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    const handleSavePlaylistData = async () => {
        if (!playlistData || !playlistData.name || !playlistData.id) {
            toast.error(
                "Please make sure the playlist name and Spotify ID are filled in and the data is obtained."
            );
            return;
        }

        // // extract image url
        // const image = playlistData.images[2].url

        const payload = {
            name: playlistData.name,
            spotifyId: playlistData.id,
            // image: image,
            jsonData: playlistData,
        };

        try {
            const response = await fetch("/api/userSavedPlaylists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(
                    "The playlist data has been successfully saved to the database!"
                );
                setIsSaved(true);
                // Reset the form or perform other operations
                setPlaylistUrl("");
                // If you need to reset playlistData, you can do it here
                // setPlaylistData(null); // Adjust according to the implementation of usePlaylistHandler
            } else {
                const errorData = await response.json();
                toast.error(
                    `Save failed: ${errorData.message || "Unknown error"}`
                );
            }
        } catch (error) {
            console.error("Error saving playlist data:", error);
            toast.error(
                "An error occurred during the save process. Please try again later."
            );
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            <main className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="loader"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : (
                    <>
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">
                                Audio Features Visualization
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
                                Audio Features Description
                            </h2>
                            <div className="bg-card text-card-foreground rounded-lg p-4">
                                {playlistData === null ? (
                                    <h2 className="text-center text-xl font-semibold m-4">
                                        :)
                                    </h2>
                                ) : (
                                    <p>{describePlaylist(playlistData)}</p>
                                )}
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
                                    onClick={() => {
                                        // pageDebug(`isLoggedIn: ${isLoggedIn}`);
                                        console.log("isLoggedIn:", isLoggedIn);
                                        if (session) {
                                            handleSavePlaylistData();
                                        } else {
                                            openAuthModal("login");
                                        }
                                    }}
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

                        {/* <section>
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
                        </section> */}
                    </>
                )}
            </main>
        </div>
    );
}
