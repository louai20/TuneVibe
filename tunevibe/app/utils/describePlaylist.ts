interface AudioFeatures {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
    loudness: number;
}

interface TrackData {
    track: {
        name: string;
        // Include other necessary fields from the track object if needed
    };
    audioFeatures: AudioFeatures;
    // Other fields like 'added_at', 'added_by', etc., can be added if required
}

interface PlaylistData {
    tracks: {
        items: TrackData[];
    };
    name: string;
}

export default function describePlaylist(playlist: PlaylistData): string {
    let avgDanceability = 0;
    let avgEnergy = 0;
    let avgValence = 0;
    let avgTempo = 0;
    let avgAcousticness = 0;
    let avgInstrumentalness = 0;
    let avgLoudness = 0;
    let trackCount = playlist.tracks.items.length;

    playlist.tracks.items.forEach(item => {
        const features = item.audioFeatures;
        avgDanceability += features.danceability;
        avgEnergy += features.energy;
        avgValence += features.valence;
        avgTempo += features.tempo;
        avgAcousticness += features.acousticness;
        avgInstrumentalness += features.instrumentalness;
        avgLoudness += features.loudness;
    });

    // Calculating averages
    avgDanceability /= trackCount;
    avgEnergy /= trackCount;
    avgValence /= trackCount;
    avgTempo /= trackCount;
    avgAcousticness /= trackCount;
    avgInstrumentalness /= trackCount;
    avgLoudness /= trackCount;

    // Creating qualitative descriptions
    const energyDescription = avgEnergy > 0.7 ? "energetic and powerful" :
                              avgEnergy > 0.4 ? "moderately energetic" : "mellow and calm";
    const danceabilityDescription = avgDanceability > 0.7 ? "highly danceable" :
                                    avgDanceability > 0.4 ? "somewhat danceable" : "more reserved in danceability";
    const moodDescription = avgValence > 0.7 ? "positive and cheerful" :
                             avgValence > 0.4 ? "moderately cheerful" : "more contemplative or subdued";

    return `The playlist '${playlist.name}' features tracks that are generally ${energyDescription}, with a ${danceabilityDescription} feel. 
            The tracks overall emit a ${moodDescription} vibe, supported by an average tempo of ${Math.round(avgTempo)} BPM. 
            The average loudness of ${avgLoudness.toFixed(2)} dB indicates a ${avgLoudness > -10 ? "louder" : "quieter"} sound profile, 
            suitable for varied listening experiences.`;
}
