// app/components/ui/playlistcard.tsx

import React, { useState } from "react";

type Track = {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
};

type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  description?: string;
  tracks: {
    items: Track[];
  };
};

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          {playlist.tracks?.items?.map((track) => (
            <div
              key={track.id} // Use track.id as the key
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
        onClick={() => console.log(`Analyzing playlist ${playlist.id}`)} // Placeholder for your analyze function
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full"
      >
        Analyze Playlist
      </button>
    </div>
  );
};

export default PlaylistCard; // Ensure you export the component
