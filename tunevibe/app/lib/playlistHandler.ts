import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Function to extract the playlist ID from the URL
const extractPlaylistId = (url: string) => {
    const match = url.match(/playlist\/(\w+)/);
    return match ? match[1] : null;
};

// Playlist handler function that manages loading and fetching
export const usePlaylistHandler = () => {
    const [playlistData, setPlaylistData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // Initialize useRouter

    const handleFetchPlaylist = async (playlistUrl: string) => {
        setIsLoading(true);
        setError(null); // Reset error state
        setPlaylistData(null); // Reset playlist data

        const playlistId = extractPlaylistId(playlistUrl);
        if (playlistId) {
            try {
                const response = await axios.get(`/api/playlist/${playlistId}`);
                const data = response.data;
                setPlaylistData(data);
                router.push(`/analysis/${playlistId}`);
                // console.log(data);
            } catch (err: any) {
                console.error("Error fetching playlist data:", err);
                setError("Error fetching playlist data.");
            }
        } else {
            setError("Invalid Spotify URL");
        }
        setIsLoading(false);
    };

    return { playlistData, isLoading, error, handleFetchPlaylist };
};
