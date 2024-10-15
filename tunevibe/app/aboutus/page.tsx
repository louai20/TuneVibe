import FloatingShapes from "@/components/FloatingShapes";
import NavBar from "@/NavBar"
import { invert } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <NavBar />
      <FloatingShapes />

      {/* Hero Section */}
      <section className="py-16 animate-fade-slide-in relative z-20">
  <div className="container mx-auto px-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold">About TuneVibe</h1>
      <p className="text-lg mt-4">
        TuneVibe is a sophisticated music analysis platform that dives deep into the audio features of your favorite playlists. Our mission is to provide you with insightful visualizations and data-driven analysis of your music, helping you understand the intricate characteristics that define your taste in music.
      </p>
    </div>
  </div>
</section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8 animate-fade-slide-in relative z-20">
        {/* Project Description */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mb-16">
          {/* Image Section */}
          <div className="lg:order-2">
            <img
              className="object-contain w-full h-auto max-h-[400px]"
              src="/moodchart.png"
              alt="Moodchart and recommendations example"
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold">Mood Analysis and Recommendations</h2>
            <p className="text-lg mt-4">
              Our mood chart provides a comprehensive overview of your playlist's emotional landscape. By analyzing key audio features like valence, energy, and danceability, we create a visual representation of your music's mood. This chart helps you understand the overall emotional tone of your playlist at a glance. Additionally, our recommendation system uses this mood analysis to suggest new tracks that align with your playlist's vibe, helping you discover music that resonates with your current mood and preferences.
            </p>
          </div>
        </div>

        {/* Bubble Chart Section */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          <div>
            <img
              className="object-contain w-full h-auto max-h-[400px]"
              src="/bubblechart.png"
              alt="Bubble chart example"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold">Uncover Patterns in Your Playlist</h2>
            <p className="text-lg mt-4">
              Our bubble chart offers an interactive way to explore the relationships between different audio features in your playlist. Each bubble represents a track, with its size and position determined by various audio characteristics. This visualization allows you to identify patterns and clusters in your music taste, helping you discover which audio features are most prominent in your favorite tracks. It's a powerful tool for understanding the nuances of your music preferences and how different songs in your playlist relate to each other.
            </p>
          </div>
        </div>
      </div>
      

                  {/* Developer Section */}
      <section className="py-16 mt-16 animate-fade-slide-in relative z-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Meet the Developers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Developer 1: Mohammed Louai Alayoubi */}
            <Card className="flex flex-col items-center p-6">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/louai20.png" alt="Mohammed Louai Alayoubi" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <CardTitle>Mohammed Louai</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center w-full">
                <div className="flex space-x-4 mt-4">
                  <a href="https://github.com/louai20" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                      alt="GitHub Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform dark:invert"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/mohammed-louai-alayoubi-67773220a/" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                      alt="LinkedIn Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Developer 2: Haohao Yu */}
            <Card className="flex flex-col items-center p-6">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/haohao2021.png" alt="Haohao Yu" />
                  <AvatarFallback>HY</AvatarFallback>
                </Avatar>
                <CardTitle>Haohao Yu</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center w-full">
                <div className="flex space-x-4 mt-4">
                  <a href="https://github.com/haohao2021" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                      alt="GitHub Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform dark:invert"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                      alt="LinkedIn Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Developer 3: Dana Ghafour Fatulla */}
            <Card className="flex flex-col items-center p-6">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/danaghafour.png" alt="Dana Ghafour Fatulla" />
                  <AvatarFallback>DG</AvatarFallback>
                </Avatar>
                <CardTitle>Dana Ghafour</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center w-full">
                <div className="flex space-x-4 mt-4">
                  <a href="https://github.com/danaghafour" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                      alt="GitHub Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform dark:invert"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/danaghafour" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                      alt="LinkedIn Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Developer 4: Malki Kothalawala */}
            <Card className="flex flex-col items-center p-6">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/malkinimesha.png" alt="Malki Kothalawala" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <CardTitle>Malki Kothalawala</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center w-full">
                <div className="flex space-x-4 mt-4">
                  <a href="https://github.com/malkinimesha" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                      alt="GitHub Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform dark:invert"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                      alt="LinkedIn Logo"
                      className="h-8 w-8 hover:scale-110 transition-transform"
                    />
                  </a>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}