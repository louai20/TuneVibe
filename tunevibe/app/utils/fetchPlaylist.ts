import axios from "axios";

export interface PlaylistData {
  name: string;
  description: string;
  tracks: {
    items: {
      track: {
        id: string;
        name: string;
        artists: {
          name: string;
        }[];
        [key: string]: any;
      };
    }[];
  };
  [key: string]: any;
}

export const fetchPlaylist = async (playlistId: string): Promise<PlaylistData> => {
  try {
    
    const tokenResponse = await axios.get('/api/token');
    const accessToken = tokenResponse.data.access_token;

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
    console.log(response.data)
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch playlist');
  }
};

