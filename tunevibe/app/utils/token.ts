// utils/token.ts
import jwt from "jsonwebtoken";

export function createVerificationToken(userId: string) {
  return jwt.sign({ userId }, process.env.NEXTAUTH_SECRET as string, {
    expiresIn: "1d", // Set expiration time
  });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string
    ) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null; // Handle token verification error
  }
}
