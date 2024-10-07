import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";

import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });

                if (!user) {
                    throw new Error("No user found with the given email");
                }

                
                const isValid = await compare(
                    credentials!.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),

        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                url: "https://accounts.spotify.com/authorize",
                params: {
                    scope: "user-read-email user-read-private",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // If this is the first time the user is logging in, assign the accessToken
            if (user) {
              token.id = user.id;
            }
            if (account && account.provider === "spotify") {
              token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // Make the accessToken available in the session
            if (token) {
              session.user.id = token.id as string;
            }
            if (token.accessToken) {
              session.accessToken = token.accessToken;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Handle custom redirect after login
            if (url.startsWith(baseUrl)) {
                return `${baseUrl}/playlist`;
            }
            return baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
