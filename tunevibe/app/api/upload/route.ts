// app/api/upload/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Prepare the form data for Imgur
  const imgurFormData = new FormData();
  imgurFormData.append("image", file);

  // Use environment variables for Client ID and Secret
  const clientId = process.env.IMGBB_CLIENT_ID;
  const clientSecret = process.env.IMGBB_CLIENT_SECRET;

  // Upload to Imgur
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${clientId}`, // Use Client ID from environment variables
    },
    body: imgurFormData,
  });

  const data = await response.json();

  if (data.success) {
    return NextResponse.json({ link: data.data.link });
  } else {
    return NextResponse.json({ error: data.message }, { status: 500 });
  }
}
