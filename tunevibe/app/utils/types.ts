import { PlaylistData } from "./fetchPlaylist";

export interface AudioFeatures {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
}

export interface PlaylistAudioFeatures extends PlaylistData {
  audioFeatures: AudioFeatures[];
}

export type AudioFeatureKey =
  | "acousticness"
  | "danceability"
  | "energy"
  | "instrumentalness"
  | "liveness"
  | "speechiness"
  | "valence";

export type FeatureKey = AudioFeatureKey | "popularity";
