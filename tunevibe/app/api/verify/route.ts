import { NextResponse } from "next/server";
import { db } from "../../../prisma/index";
import { verifyToken } from "@/utils/token";

// Named export for the GET request
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const userId = verifyToken(token); // Verify the token and get the user ID
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  // Update user to set isVerified to true
  await db.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  return NextResponse.json({ message: "Email verified successfully" });
}
