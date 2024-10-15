import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "../../prisma/index";

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
                const user = await db.user.findUnique({
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
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            if (account && account.provider === "spotify") {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                if (!session.user) {
                    session.user = {}; // Initialize user if it's undefined
                }

                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
        // async redirect({ url, baseUrl }) {
        //     if (url.startsWith(baseUrl)) {
        //         return `${baseUrl}/playlist`;
        //     }
        //     return baseUrl;
        // },
    },
    secret: process.env.NEXTAUTH_SECRET,
};