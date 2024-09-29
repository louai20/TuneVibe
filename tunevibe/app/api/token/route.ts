import { NextResponse } from 'next/server';

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function GET() {
  const currentTime = Date.now();

  if (accessToken && tokenExpiresAt && currentTime < tokenExpiresAt) {
    return NextResponse.json({ access_token: accessToken });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  accessToken = data.access_token;
  tokenExpiresAt = currentTime + data.expires_in * 1000;

  return NextResponse.json({ access_token: accessToken });
}
