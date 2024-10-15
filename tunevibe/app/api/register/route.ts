// app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail"; // Import sendEmail utility
import { createVerificationToken } from "@/utils/token"; // Import your token utility

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false, // Set isVerified to false initially
      },
    });

    // Create a verification token
    const token = createVerificationToken(user.id);

    // Send a verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verificationUrl}`,
    });

    return NextResponse.json({
      message:
        "User registered successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
