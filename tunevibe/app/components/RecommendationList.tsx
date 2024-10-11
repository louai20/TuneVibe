"use client";

import { useState, useRef, useEffect } from "react";
import { Flex, Table, Badge, Avatar, Box, Text } from "@radix-ui/themes";
import { PlayIcon, PauseIcon, ReloadIcon, MagicWandIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function RecommendationList({ data }: any) {

    // Return early if data is not available
    if (!data || !data.tracks || !data.tracks.items) {
        return <div className="text-center">No data available</div>;
    }

    const [playing, setPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTrackUrl, setCurrentTrackUrl] = useState("");
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [recommendations, setRecommendations] = useState<any>(null);

    const play = (url: string) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlaying(true);
      setCurrentTrackUrl(url);
    };
  
    const pause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlaying(false);
    };

    const getRecommendations = async () => {
        setIsLoading(true)
        let params = prepareData(data);

        const response = await axios.get(`/api/getRecommendations/${params}`);
        const responseData = response.data;
        console.log(responseData)
        setRecommendations(responseData);
        setIsLoading(false)
    }

    useEffect(() => {
        getRecommendations();
    }, []);

    if (!recommendations) {
        return <div className="text-center">No data available</div>;
    }

    return (
    <div>

        <div className="flex items-center justify-between mb-4">
            <div className="flex-grow text-center">
                <h1 className="text-xl font-bold">Recommendations</h1>
            </div>
            <Button onClick={getRecommendations}> 
                { isLoading ? (<MagicWandIcon className="h-4 w-4" />) : (<ReloadIcon className="h-4 w-4" />) }
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Table.Root size="1" className="h-96" variant="surface">
                <Table.Body>
                    {recommendations.tracks.map((item: any, index: any) => (
                    <Table.Row key={index}>
                        <Table.Cell className="text-center w-9">
                        <button hidden={item.preview_url == null} 
                                onClick={() => playing && currentTrackUrl == item.preview_url ? pause() : play(item.preview_url)}> {playing && currentTrackUrl == item.preview_url ? <PauseIcon /> : <PlayIcon />} 
                        </button>
                        </Table.Cell>
                        <Table.Cell>
                        <Flex gap="3" align="center">
                            <Avatar src={item.album.images[2]?.url} size="1" fallback="A" radius="large"/>
                            <Box>
                                <Text as="div" size="1" weight="bold">
                                    {item.name}
                                </Text>
                                <Text as="div" size="1" color="gray">
                                    {item.artists[0]?.name} 
                                </Text>
                            </Box>
                        </Flex>
                        </Table.Cell>
                        <Table.Cell>
                        <Flex gap="1" align="center">
                            <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <Badge color="green" radius="large">Spotify</Badge>
                            </a>
                        </Flex>
                        </Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <div className="flex flex-wrap justify-center overflow-hidden">
                {recommendations.tracks.slice(0, 10).map((item: any, index: any) => (
                    <div key={index} className={`m-2 ${index >= 4 ? 'hidden sm:block' : ''}`} >
                        <div className="w-32 h-32 rounded-full overflow-hidden transition-opacity duration-300 hover:opacity-75">
                            <img src={item.album.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </div>
    );
}

function prepareData (data: any):any {

    const valences = data.tracks.items.map((item:any) => item.audioFeatures.valence);
    const energies = data.tracks.items.map((item:any) => item.audioFeatures.energy);
    const danceabilities = data.tracks.items.map((item:any) => item.audioFeatures.danceability);
    const acousticnesses = data.tracks.items.map((item:any) => item.audioFeatures.acousticness);
  
    const index1 = Math.floor(Math.random() * data.tracks.items.length);
    const index2 = Math.floor(Math.random() * data.tracks.items.length);
  
    const randomPairs = (index1 === index2 && data.tracks.items.length > 1) ? 
                            [data.tracks.items[index1]] : [data.tracks.items[index1], data.tracks.items[index2]];
  
    const artistIds = randomPairs.map((item:any) => item.track.artists[0].id).join(",");
    const trackIds = randomPairs.map((item:any) => item.track.id).join(",");
  
    const params = {
        limit: '10',
        market: "SE",
        seed_artists: artistIds,
        seed_tracks: trackIds,
        // seed_genres: "pop",
        min_valence: getMinMax(valences)[0].toString(),
        max_valence: getMinMax(valences)[1].toString(),
        min_energy: getMinMax(energies)[0].toString(),
        max_energy: getMinMax(energies)[1].toString(),
        min_danceability: getMinMax(danceabilities)[0].toString(),
        max_danceability: getMinMax(danceabilities)[1].toString(),
        min_acousticness: getMinMax(acousticnesses)[0].toString(),
        max_acousticness: getMinMax(acousticnesses)[1].toString(),
    };
  
    const queryString = new URLSearchParams(params).toString();
    
    return queryString;
}

function getMinMax (values:any) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min, max];
}