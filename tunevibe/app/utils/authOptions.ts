import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "../../prisma/index";
import { createVerificationToken } from "@/utils/token";
import { sendEmail } from "@/utils/sendEmail";

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

        if (!user.isVerified) {
          try {
            // Log base URL and email to verify values
            console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
            console.log("Sending verification email to:", user.email);

            // Send verification email
            const token = createVerificationToken(user.id);
            const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;

            await sendEmail({
              to: user.email,
              subject: "Verify your email",
              text: `Click this link to verify your email: ${verificationUrl}`,
            });

            console.log("Verification email sent");

            throw new Error("Email not verified. Verification link sent.");
          } catch (error) {
            console.error("Error sending verification email:", error);
            throw new Error(
              "Failed to send verification email. Please try again."
            );
          }
        }

        const isValid = await compare(credentials!.password, user.password);

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
