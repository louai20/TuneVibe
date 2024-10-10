// types/next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default Session and JWT types
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string | null;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}
