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

    const clearError = () => {
        setError(null);
    };
    
    const handleFetchPlaylist = async (playlistUrl: string) => {
        setIsLoading(true);
        setError(null); // Reset error state
        setPlaylistData(null); // Reset playlist data

        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) {
            setError("Invalid Spotify playlist URL. Please enter a valid URL.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/playlist/${playlistId}`);
            const data = response.data;
            setPlaylistData(data);
            router.push(`/analysis/${playlistId}`);
        } catch (err: any) {
            console.error("Error fetching playlist data:", err);
            setError(err.response?.data?.error || "Error fetching playlist data. Please try again.");
        }
        setIsLoading(false);
    };

    return { playlistData, isLoading, error, handleFetchPlaylist, clearError };
};
