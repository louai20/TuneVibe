// types/next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default Session and JWT types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
