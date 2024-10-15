import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {

  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const queryString = new URLSearchParams(searchParams).toString();
  
    const cookieStore = cookies();
  
    let accessToken = cookieStore.get('spotify_access_token')?.value;
    const tokenExpiration = cookieStore.get('spotify_token_expiration')?.value;
    
    // Check if token is missing or expired
    if (!accessToken || !tokenExpiration || Date.now() >= parseInt(tokenExpiration)) {

      const { token, expires_in } = await getAccessToken();
      accessToken = token;
      const expirationTime = Date.now() + expires_in * 1000;

      // Only set the cookie if the token is defined
      if (accessToken) {
        cookieStore.set('spotify_access_token', accessToken, {
          httpOnly: true,
          maxAge: expires_in,
          secure: true,
        });
      }

      // Set expiration time in the cookie
      cookieStore.set('spotify_token_expiration', expirationTime.toString(), {
        httpOnly: true,
        maxAge: expires_in,
        secure: true,
      });             
    }

    // Make the request to the Spotify API with the valid access token
    const recommendationsResponse = await fetch(
      `https://api.spotify.com/v1/recommendations?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!recommendationsResponse.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const recommendationsData = await recommendationsResponse.json();
  
    return NextResponse.json(recommendationsData, { status: 200 });
  }
  catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

async function getAccessToken() {
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: tokenParams.toString(),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }
  
    const data = await response.json();
    return {
      token: data.access_token,
      expires_in: data.expires_in,
    };
}
