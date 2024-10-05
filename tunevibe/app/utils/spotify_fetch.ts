const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

/**
 * Fetches the user's playlists from Spotify.
 *
 * @param {string} accessToken - The access token for authenticating the Spotify API request.
 * @returns {Promise<Response>} The response object containing the playlists data.
 */
export async function getUsersPlaylists(
  accessToken: string
): Promise<Response> {
  const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists from Spotify");
  }

  return response;
}
