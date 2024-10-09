"use client";

import NavBar from "@/NavBar";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MusicIcon, BarChart2Icon, UserIcon } from "lucide-react";

// This would typically come from an API or database
const userData = {
    name: "Alice Johnson",
    email: "alice@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
};

const playlists = [
    {
        id: 1,
        name: "Summer Vibes 2023",
        trackCount: 25,
        lastAnalyzed: "2023-06-15",
    },
    { id: 2, name: "Workout Mix", trackCount: 40, lastAnalyzed: "2023-05-20" },
    {
        id: 3,
        name: "Chill Evening",
        trackCount: 30,
        lastAnalyzed: "2023-06-01",
    },
];

const analysisResults = [
    {
        id: 1,
        name: "Summer Vibes 2023",
        date: "2023-06-15",
        mood: "Upbeat",
        topThemes: ["Joy", "Energy", "Romance"],
    },
    {
        id: 2,
        name: "Workout Mix",
        date: "2023-05-20",
        mood: "Energetic",
        topThemes: ["Motivation", "Power", "Rhythm"],
    },
    {
        id: 3,
        name: "Chill Evening",
        date: "2023-06-01",
        mood: "Relaxed",
        topThemes: ["Calm", "Introspection", "Melody"],
    },
];

export default function UserAccount() {
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send an API request to update the user's profile
        console.log("Profile updated:", { name, email });
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>
                                Manage your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage
                                        src={userData.avatarUrl}
                                        alt={userData.name}
                                    />
                                    <AvatarFallback>
                                        <UserIcon className="w-12 h-12" />
                                    </AvatarFallback>
                                </Avatar>
                                <form
                                    onSubmit={handleUpdateProfile}
                                    className="space-y-4 w-full"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Update Profile
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="playlists">
                        <TabsList className="mb-4">
                            <TabsTrigger value="playlists">
                                My Playlists
                            </TabsTrigger>
                            <TabsTrigger value="analysis">
                                Analysis History
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="playlists">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Playlists</CardTitle>
                                    <CardDescription>
                                        View and manage your saved playlists
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {playlists.map((playlist) => (
                                            <div
                                                key={playlist.id}
                                                className="flex items-center justify-between p-4 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <MusicIcon className="w-8 h-8 text-primary" />
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {playlist.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                playlist.trackCount
                                                            }{" "}
                                                            tracks
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Last analyzed:{" "}
                                                    {playlist.lastAnalyzed}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="analysis">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Analysis History</CardTitle>
                                    <CardDescription>
                                        Review your past mood analysis results
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {analysisResults.map((result) => (
                                            <div
                                                key={result.id}
                                                className="p-4 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold">
                                                        {result.name}
                                                    </h3>
                                                    <span className="text-sm text-muted-foreground">
                                                        {result.date}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <BarChart2Icon className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">
                                                        Overall Mood:{" "}
                                                        {result.mood}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.topThemes.map(
                                                        (theme, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full"
                                                            >
                                                                {theme}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="mt-8">
                    <Link href="/" className="text-primary hover:underline">
                        &larr; Back to Music Mood Analyzer
                    </Link>
                </div>
            </div>
        </div>
    );
}
