import NavBar from "@/NavBar"

export default function Page() {
  return (
    <div>
      <NavBar />

      {/* Hero Section */}
      <section className="bg-gray-100 py-16 animate-fade-slide-in">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
            <p className="text-lg text-gray-600 mt-4">
            At TuneVibe, our mission was to revolutionize how users interact with music by providing data visualization for music analysis and insights into their listening habits. We wanted to provide features that would provide the most value to users. This user-centric approach led us to build the essential features of TuneVibe first, ensuring a seamless experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8 animate-fade-slide-in">
        {/* Project Description */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          {/* Image Section */}
          <div>
            <img
              className="rounded-lg shadow-md object-cover"
              src="https://example.com/playlist-analysis.png"
              alt="Music Sentiment Analysis"
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white-900">Our Development Journey</h2>
            <p className="text-lg text-white-600 mt-4">
            Building TuneVibe was a collaborative effort between passionate developers who wanted to enhance the way people engage with their music. Throughout the development process, we encountered various technical challenges, because ensuring a smooth user experience on our platform was a top priority. At the core of it—in every decision made—the driving factor was a desire to create a tool that was not only functional but also easy to use.</p>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <section className="py-16 mt-16 bg-gray-100 animate-fade-slide-in">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Meet the Developers</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-8">
            
            {/* Developer 1: Mohammed Louai Alayoubi */}
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <img
                src="https://github.com/louai20.png"
                alt="Mohammed Louai Alayoubi Avatar"
                className="h-32 w-32 rounded-full hover:scale-110 transition-transform mb-4"
              />
              {/* Developer Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mohammed Louai Alayoubi</h3>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {/* GitHub Logo */}
                <a href="https://github.com/louai20" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                    alt="GitHub Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
                {/* LinkedIn Logo */}
                <a href="https://www.linkedin.com/in/mohammed-louai-alayoubi-67773220a/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                    alt="LinkedIn Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Developer 2: Haohao Yu */}
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <img
                src="https://github.com/haohao2021.png"
                alt="Haohao Yu Avatar"
                className="h-32 w-32 rounded-full hover:scale-110 transition-transform mb-4"
              />
              {/* Developer Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Haohao Yu</h3>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {/* GitHub Logo */}
                <a href="https://github.com/haohao2021" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                    alt="GitHub Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
                {/* LinkedIn Logo */}
                <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                    alt="LinkedIn Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Developer 3: Dana Ghafour Fatulla */}
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <img
                src="https://github.com/danaghafour.png"
                alt="Dana Ghafour Avatar"
                className="h-32 w-32 rounded-full hover:scale-110 transition-transform mb-4"
              />
              {/* Developer Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Dana Ghafour Fatulla</h3>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {/* GitHub Logo */}
                <a href="https://github.com/danaghafour" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                    alt="GitHub Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
                {/* LinkedIn Logo */}
                <a href="https://www.linkedin.com/in/danaghafour" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                    alt="LinkedIn Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Developer 4: Malki Kothalawala */}
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <img
                src="https://github.com/malkinimesha.png"
                alt="Malki Kothalawala"
                className="h-32 w-32 rounded-full hover:scale-110 transition-transform mb-4"
              />
              {/* Developer Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Malki Kothalawala</h3>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {/* GitHub Logo */}
                <a href="https://github.com/malkinimesha" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                    alt="GitHub Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
                {/* LinkedIn Logo */}
                <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                    alt="LinkedIn Logo"
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
