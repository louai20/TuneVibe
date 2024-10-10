"use client";
import { useState, useRef } from "react";
import { Flex, Table, Badge, Avatar, Box, Text } from "@radix-ui/themes";
import { Doughnut, Radar, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, ArcElement, Legend, RadialLinearScale, LineElement, BarElement, CategoryScale } from "chart.js";
ChartJS.register(Tooltip, ArcElement, Legend, RadialLinearScale, LineElement, BarElement, CategoryScale);

export default function MoodChart({ data }: any) {
  // console.log(data);

  // Return early if data is not available
  if (!data || !data.tracks || !data.tracks.items) {
    return <div className="text-center">No data available</div>;
  }

  const chartData = getChartData(data);

  const options:any = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    },
  };

  // Return early if chartData is not valid
  if (!chartData) {
    return <div className="text-center">Unable to generate chart</div>;
  }

  const [playing, setPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [chartType, setChartType] = useState('bar'); 

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


  return (
    <div>
      <h2 className="text-center text-xl font-semibold m-4">
        {data.description}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Table.Root size="1" className="h-72">
          <Table.Body>
            {data.tracks.items.map((item: any, index: any) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Flex gap="3" align="center">
                    <Avatar
                      src={item.track.album.images[2]?.url}
                      size="1"
                      fallback="A"
                      radius="large"
                    />
                    <Box>
                      <Text as="div" size="1" weight="bold">
                        {item.track.name}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        {item.track.artists[0]?.name} 
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="1" align="center">
                    <Badge color="green" radius="large">
                      Danceability{" "}
                      {Math.round(item.audioFeatures.danceability * 100)}%
                    </Badge>
                    <Badge color="yellow" radius="large">
                      Valence {Math.round(item.audioFeatures.valence * 100)}%
                    </Badge>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <div className="flex flex-col justify-center items-center">
          <div className="h-72">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
      <h2 className="text-center text-xl font-semibold mt-20 mb-7">Recommendations</h2>   
      <div>
        <Table.Root size="2" className="h-96" variant="surface">
          <Table.Body>
            {data.tracks.items.map((item: any, index: any) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <button hidden={item.track.preview_url == null} 
                          onClick={() => playing && currentTrackUrl == item.track.preview_url ? pause() : play(item.track.preview_url)}> {playing && currentTrackUrl == item.track.preview_url ? "Pause" : "Play"} 
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3" align="center">
                    <Avatar
                      src={item.track.album.images[2]?.url}
                      size="1"
                      fallback="A"
                      radius="large"
                    />
                    <Box>
                      <Text as="div" size="1" weight="bold">
                        {item.track.name}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        {item.track.artists[0]?.name} 
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="1" align="center">
                    <Badge color="green" radius="large">
                      Danceability {Math.round(item.audioFeatures.danceability * 100)}%
                    </Badge>
                    <Badge color="yellow" radius="large">
                      Liveness {Math.round(item.audioFeatures.liveness * 100)}%
                    </Badge>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}

function getChartData(data: any): any {
  if (
    !data ||
    !data.tracks ||
    !data.tracks.items ||
    data.tracks.items.length === 0
  ) {
    return; // Return early if data is not valid
  }

  const valences = data.tracks.items.map((item:any) => item.audioFeatures.valence);
  const energies = data.tracks.items.map((item:any) => item.audioFeatures.energy);
  const danceabilities = data.tracks.items.map((item:any) => item.audioFeatures.danceability);
  const tempos = data.tracks.items.map((item:any) => item.audioFeatures.tempo);
  const loudnesses = data.tracks.items.map((item:any) => item.audioFeatures.loudness);
  const acousticnesses = data.tracks.items.map((item:any) => item.audioFeatures.acousticness);

  const normalizedTempos = normalize(tempos);
  const normalizedLoudnesses = normalize(loudnesses);

  const averageValence = valences.reduce((a:any, b:any) => a + b) / valences.length;
  const averageEnergy = energies.reduce((a:any, b:any) => a + b) / energies.length;
  const averageDanceability = danceabilities.reduce((a:any, b:any) => a + b) / danceabilities.length;
  const averageNormalizedTempo = normalizedTempos.reduce((a:any, b:any) => a + b) / normalizedTempos.length;
  const averageNormalizedLoudness = normalizedLoudnesses.reduce((a:any, b:any) => a + b) / normalizedLoudnesses.length;
  const averageAcousticness = acousticnesses.reduce((a:any, b:any) => a + b) / acousticnesses.length;

  const moodScore =
      (0.40 * averageValence) +
      (0.25 * averageEnergy) +
      (0.15 * averageDanceability) +
      (0.10 * averageNormalizedTempo) +
      (0.05 * averageNormalizedLoudness) +
      (0.05 * averageAcousticness);

  return {
    labels: ["Valence", "Energy", "Danceability", "Tempo", "Loudness", "Acousticness"],
    datasets: [
      {
        label: '',
        data: [averageValence*100, averageEnergy*100, averageDanceability*100, averageNormalizedTempo*100, averageNormalizedLoudness*100, averageAcousticness*100],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 99, 5)"],
        hoverOffset: 2,
      },
    ],
  };
}


function normalize (values:any) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value:any) => (value - min) / (max - min));
}