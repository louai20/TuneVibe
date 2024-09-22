'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CloudIcon, DownloadIcon, ShareIcon, SpotifyIcon, UserIcon } from "lucide-react"

// Assume we have a WordCloud component
const WordCloud = ({ words }: { words: string[] }) => (
  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
    <CloudIcon className="w-12 h-12 text-muted-foreground" />
    <span className="ml-2 text-muted-foreground">Word Cloud Placeholder</span>
  </div>
)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // This would be populated with actual data in a real application
  const sampleWords = ["love", "heartbreak", "dance", "party", "sad", "happy"]
  const sampleTracks = [
    { title: "Happy", artist: "Pharrell Williams", mood: "Joyful" },
    { title: "Someone Like You", artist: "Adele", mood: "Melancholic" },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", mood: "Energetic" },
  ]

  const handleLogin = () => {
    // Implement actual login logic here
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowProfile(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TuneVibe</h1>
          <nav className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(true)}>Login</Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showProfile ? (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <div className="bg-card text-card-foreground rounded-lg p-4">
              <h3 className="font-semibold mb-2">John Doe</h3>
              <p className="text-sm text-muted-foreground mb-4">john.doe@example.com</p>
              <h4 className="font-semibold mb-2">My Playlists</h4>
              <ul className="list-disc list-inside">
                <li>Summer Hits 2023</li>
                <li>Workout Mix</li>
                <li>Chill Vibes</li>
              </ul>
              <Button className="mt-4" onClick={() => setShowProfile(false)}>Back to Analysis</Button>
            </div>
          </section>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Import or Select Music</h2>
              <div className="flex space-x-4">
                <Button className="flex items-center">
                  {/* <SpotifyIcon className="mr-2 h-4 w-4" /> */}
                  Import from Spotify
                </Button>
                <Input type="text" placeholder="Search for a song..." className="flex-grow" />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Mood and Lyrics Analysis</h2>
              <Tabs defaultValue="wordcloud">
                <TabsList>
                  <TabsTrigger value="wordcloud">Word Cloud</TabsTrigger>
                  <TabsTrigger value="chart">Mood Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="wordcloud">
                  <WordCloud words={sampleWords} />
                </TabsContent>
                <TabsContent value="chart">
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Mood Chart Placeholder</span>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <div className="bg-card text-card-foreground rounded-lg p-4">
                <p className="mb-2">Overall Mood: Energetic and Upbeat</p>
                <p className="mb-2">Dominant Themes: Love, Celebration, Friendship</p>
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
              <h2 className="text-xl font-semibold mb-4">Discover Similar Music</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTracks.map((track, index) => (
                  <div key={index} className="bg-card text-card-foreground rounded-lg p-4">
                    <h3 className="font-semibold">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <p className="text-sm mt-2">Mood: {track.mood}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login or Sign Up</DialogTitle>
            <DialogDescription>
              Enter your details to access your account or create a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="email" placeholder="Email" />
            <Input id="password" type="password" placeholder="Password" />
            <Button onClick={handleLogin}>Login</Button>
            <Button variant="outline">Sign Up</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
