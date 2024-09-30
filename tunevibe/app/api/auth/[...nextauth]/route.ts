import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // Passwordless / email sign in
    /*Provider.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),*/
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "user-read-email user-read-private", // Add necessary Spotify scopes here
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If login is successful, redirect to playlist page
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/playlist`; // Redirect to the playlist page
      } else {
        return baseUrl; // Fallback to the home page if something goes wrong
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  // Optional SQL or MongoDB database to persist users
  //database: process.env.DATABASE_URL,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
