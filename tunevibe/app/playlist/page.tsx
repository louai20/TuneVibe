"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useSession } from "next-auth/react"; // Import useSession

type Track = {
  id: string;
  name: string;
  artists: { name: string }[]; // Artists is an array
};

type Playlist = {
  id: string;
  name: string;
  description?: string;
  images?: { url: string }[]; // Added images property for album images
  tracks?: Track[]; // Optional tracks for each playlist
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
              const tracksResponse = await fetch(playlist.tracks?.href, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`, // Use session access token if required
                },
              });
              const tracksData = await tracksResponse.json();

              // Filter out duplicate tracks based on track ID
              const uniqueTracks = Array.from(
                new Set(tracksData.items.map((track: any) => track.track.id))
              ).map((id) => {
                return tracksData.items.find(
                  (track: any) => track.track.id === id
                ).track;
              });

              return {
                ...playlist,
                tracks: uniqueTracks.map((track: any) => ({
                  id: track.id,
                  name: track.name,
                  artists: track.artists,
                })),
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

          {playlist.tracks?.map((track) => (
            <div
              key={track.id}
              className="flex border-b border-gray-600 hover:bg-gray-700"
            >
              <div className="p-3 w-full">{track.name}</div>
              <div className="p-3 w-full">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() =>
          router.push(
            `/home?playlistUrl=${encodeURIComponent(
              playlist.external_urls.spotify
            )}`
          )
        } // Change `/analyze/${playlist.id}` to your actual analyze page route
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full"
      >
        Analyze Playlist
      </button>
    </div>
  );
};
