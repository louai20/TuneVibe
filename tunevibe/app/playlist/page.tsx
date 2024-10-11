"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useSession } from "next-auth/react"; // Import useSession.
import { Flex, Avatar, Box } from "@radix-ui/themes";

type Artist = {
  name: string; // Define the type for artist
};

type Track = {
  id: string;
  name: string;
  artists: Artist[]; // Use the defined Artist type
  href: string;
  album: {
    images: { url: string }[]; // Add album images here
  };
};

type Playlist = {
  id: string;
  name: string;
  description?: string;
  images?: { url: string }[]; // Added images property for album images
  tracks: {
    // reflect the API response
    href: string; // URL to fetch the tracks
    total: number;
    items: Track[]; // An array of tracks
  };
  external_urls: { spotify: string }; // External URLs for the playlist
};

export default function Playlists() {
  const { data: session } = useSession(); // Use useSession to get the session
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchPlaylists = async () => {
      setIsLoading(true); // Set loading state

      try {
        const response = await fetch("/api/userPlayList");
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const data = await response.json();
        console.log("Fetched Playlists:", data); // Log fetched data for debugging

        // Only update state if the component is still mounted
        if (isMounted) {
          const playlistsWithTracks = await Promise.all(
            data.items.map(async (playlist: Playlist) => {
              // Check if tracks is defined before accessing href
              if (!playlist.tracks) {
                throw new Error("Tracks are undefined");
              }

              const tracksResponse = await fetch(playlist.tracks.href, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`, // Use session access token if required
                },
              });

              if (!tracksResponse.ok) {
                throw new Error("Failed to fetch tracks");
              }

              const tracksData = await tracksResponse.json();

              // Filter out duplicate tracks based on track ID
              const uniqueTracks = Array.from(
                new Set(tracksData.items.map((track: any) => track.track.id))
              ).map((id) => {
                return tracksData.items.find(
                  (track: any) => track.track.id === id
                )?.track; // Make sure to check for undefined
              });

              return {
                ...playlist,
                tracks: {
                  href: playlist.tracks.href, // Include the href from playlist.tracks
                  total: tracksData.total, // Total number of tracks
                  items: uniqueTracks.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists,
                    album: track.album, // Include album for image access
                  })),
                },
              };
            })
          );

          setPlaylists(playlistsWithTracks); // Set playlists with their respective tracks
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false); // Reset loading state only if still mounted
        }
      }
    };

    if (session) {
      fetchPlaylists(); // Call the fetch function only if session is available
    }

    return () => {
      isMounted = false; // Cleanup function to mark component as unmounted
    };
  }, [session]); // Add session as a dependency to rerun when it changes

  // Rendering logic
  if (isLoading) {
    return <p>Loading playlists...</p>; // Show loading state
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  return (
    <div className="bg-black text-gray-300 min-h-screen p-10">
      <h1 className="text-white text-4xl mb-6">
        Choose a playlist to analyze:
      </h1>
      <h6 className="text-white text-2xl mb-6">Your Playlists:</h6>
      <div className="space-y-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  const analyzePlaylist = async () => {
    // First, save the playlist URL in the database
    try {
      const response = await fetch("/api/savePlayList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlist.name,
          url: playlist.external_urls.spotify, // Save the external URL
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save playlist");
      }
      const data = await response.json();
      console.log("Playlist saved successfully!", data);

      // After saving, navigate to the home page
      router.push(`/home`); // Navigate to home without URL
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {playlist.images?.[0]?.url && (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-16 h-16 rounded-md mr-4"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{playlist.name}</h2>
            {playlist.description && (
              <p className="text-gray-500">{playlist.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-500 hover:underline"
        >
          {isOpen ? "▲ Hide Tracks" : "▼ Show Tracks"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4">
          <div className="flex text-gray-600">
            <div className="p-2 w-8 flex-shrink-0"></div>
            <div className="p-2 w-full">Title</div>
            <div className="p-2 w-full">Artist</div>
          </div>
          {playlist.tracks?.items.map((track) => (
            <Flex
              key={track.id}
              gap="3"
              align="center"
              className="border-b border-gray-600 hover:bg-gray-700 p-3"
            >
              {/* Avatar for track image or fallback */}
              <Avatar
                src={track.album.images[2]?.url || undefined} // Use the smaller image or undefined if no image
                size="2" // Increased size for larger avatar
                fallback="A" // Fallback if no image
                radius="large"
              />

              {/* Track details (name and artists) */}
              <Box>
                <div className="text-white">{track.name}</div>
                <div className="text-sm text-gray-400">
                  {track.artists
                    .map((artist: Artist) => artist.name)
                    .join(", ")}{" "}
                  {/* Explicitly type 'artist' */}
                </div>
              </Box>
            </Flex>
          ))}
        </div>
      )}

      <button
        onClick={analyzePlaylist} // Call analyzePlaylist to route to home
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full"
      >
        Analyze Playlist
      </button>
    </div>
  );
};
