import React from "react";

const spotify_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const spotify_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URL;
const spotify_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE = "user-read-private user-read-email"; // Customize scopes as needed

const Login: React.FC = () => {
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

  return (
    <div>
      <h1>Login to Spotify</h1>
      <a href={loginUrl}>Login with Spotify</a>
    </div>
  );
};

export default Login;
