"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

type Playlist = {
    id: string;
    name: string;
    description?: string;
    images?: { url: string }[];
    external_urls: { spotify: string };
};

interface PlaylistCardProps {
    playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("playlistUrl", playlist.external_urls.spotify);
    };

    return (
        <Card
            className="bg-card hover:bg-accent transition-colors duration-200 cursor-pointer"
            draggable
            onDragStart={handleDragStart}
        >
            <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 rounded-md">
                        <img
                            src={
                                playlist.images?.[0]?.url || "/placeholder.svg"
                            }
                            alt={playlist.name}
                            className="object-cover"
                        />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-foreground truncate">
                            {playlist.name}
                        </h2>
                        {playlist.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {playlist.description}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlaylistCard;
