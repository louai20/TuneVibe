"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CloudIcon, DownloadIcon, ShareIcon, UserIcon } from "lucide-react";
import NavBar from "@/NavBar";
import { signIn, signOut, useSession } from "next-auth/react";
import MoodChart from "@/mood-chart/page";

// import { fetchPlaylist, PlaylistData } from "@/utils/fetchPlaylist";
// import { PlaylistAudioFeatures } from "@/utils/types";

// Assume we have a WordCloud component
const WordCloud = ({ words }: { words: string[] }) => (
  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
    <CloudIcon className="w-12 h-12 text-muted-foreground" />
    <span className="ml-2 text-muted-foreground">Word Cloud Placeholder</span>
  </div>
);

export default function Home() {
  // This would be populated with actual data in a real application
  const sampleWords = ["love", "heartbreak", "dance", "party", "sad", "happy"];
  const sampleTracks = [
    { title: "Happy", artist: "Pharrell Williams", mood: "Joyful" },
    { title: "Someone Like You", artist: "Adele", mood: "Melancholic" },
    {
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      mood: "Energetic",
    },
  ];

  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractPlaylistId = (url: string) => {
    const match = url.match(/playlist\/(\w+)/);
    return match ? match[1] : null;
  };

  // const handleFetchPlaylist = async () => {
  //     setIsLoading(true);
  //     setPlaylistData(null);

  //     const playlistId = extractPlaylistId(playlistUrl);
  //     if (playlistId) {
  //         try {
  //             const data = await fetchPlaylist(playlistId);
  //             setPlaylistData(data);
  //             console.log(data);
  //         } catch (error) {
  //             console.error("Error fetching playlist data:", error);
  //         }
  //     } else {
  //         console.error("Invalid Spotify URL");
  //     }
  //     setIsLoading(false);
  // };

  const handleFetchPlaylist = async () => {
    setIsLoading(true);
    setPlaylistData(null);

    const playlistId = extractPlaylistId(playlistUrl);
    if (playlistId) {
      try {
        const response = await axios.get(`/api/playlist/${playlistId}`);
        const data = response.data;
        setPlaylistData(data);
        console.log(data);
      } catch (error: any) {
        console.error("Error fetching playlist data:", error);
        // set error status
      }
    } else {
      console.error("Invalid Spotify URL");
      // set error status
    }
    setIsLoading(false);
  };
  // nextauth
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {
          // showProfile ? (
          //   <section className="mb-8">
          //     <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          //     <div className="bg-card text-card-foreground rounded-lg p-4">
          //       <h3 className="font-semibold mb-2">John Doe</h3>
          //       <p className="text-sm text-muted-foreground mb-4">john.doe@example.com</p>
          //       <h4 className="font-semibold mb-2">My Playlists</h4>
          //       <ul className="list-disc list-inside">
          //         <li>Summer Hits 2023</li>
          //         <li>Workout Mix</li>
          //         <li>Chill Vibes</li>
          //       </ul>
          //       <Button className="mt-4" onClick={() => setShowProfile(false)}>Back to Analysis</Button>
          //     </div>
          //   </section>
          // ) : (
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
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Imported from {session.user?.name} <br /> Sign out
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
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  placeholder="OR Enter the URL of a specific playlist"
                  className="flex-grow"
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  className="flex items-center"
                  onClick={handleFetchPlaylist}
                >
                  Analyse
                </Button>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Mood and Lyrics Analysis
              </h2>
              <Tabs defaultValue="moodchart">
                <TabsList>
                  <TabsTrigger value="moodchart">Mood Chart</TabsTrigger>
                  <TabsTrigger value="wordcloud">Word Cloud</TabsTrigger>
                </TabsList>
                <TabsContent value="moodchart">
                  <MoodChart data={playlistData} />
                </TabsContent>
                <TabsContent value="wordcloud">
                  <WordCloud words={sampleWords} />
                </TabsContent>
              </Tabs>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <div className="bg-card text-card-foreground rounded-lg p-4">
                <p className="mb-2">Overall Mood: Energetic and Upbeat</p>
                <p className="mb-2">
                  Dominant Themes: Love, Celebration, Friendship
                </p>
                <p>Top Keywords: Dance, Party, Together, Night, Fun</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Share and Download</h2>
              <div className="flex space-x-4">
                <Button className="flex items-center">
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share Analysis
                </Button>
                <Button variant="outline" className="flex items-center">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Results
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
                    <h3 className="font-semibold">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {track.artist}
                    </p>
                    <p className="text-sm mt-2">Mood: {track.mood}</p>
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
