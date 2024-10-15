import { useState, useRef, useEffect } from "react";
import { Flex, Table, Badge, Avatar, Box, Text } from "@radix-ui/themes";
import { Doughnut, Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  Legend,
  RadialLinearScale,
  LineElement,
  BarElement,
  CategoryScale,
} from "chart.js";
import _ from "lodash";

// Registering Chart.js components
ChartJS.register(
  Tooltip,
  ArcElement,
  Legend,
  RadialLinearScale,
  LineElement,
  BarElement,
  CategoryScale
);

export default function MoodChart({ data }: any) {
  if (!data || !data.tracks || !data.tracks.items) {
    return <div className="text-center">No data available</div>;
  }

  const chartData = getChartData(data);
  const options: any = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (!chartData) {
    return <div className="text-center">Unable to generate chart</div>;
  }

  const [chartType, setChartType] = useState("bar");

  return (
    <div>
      <h2 className="text-center text-xl font-semibold m-4">
        {data.description}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Table.Root size="1" className="h-72">
          <Table.Body>
            {data.tracks.items.map((item: any, index: any) => {
              // Get values for the badges
              const danceability = item.audioFeatures?.danceability || 0;
              const valence = item.audioFeatures?.valence || 0;
              const energy = item.audioFeatures?.energy || 0;

              // Determine adjectives based on the values
              const danceabilityBadge = danceability > 0.7 ? "Goovy" : danceability > 0.4 ? "Medium" : "Stiff";
              const valenceBadge = valence > 0.7 ? "Uplifting" : valence > 0.4 ? "Neutral" : "Sad";
              const energyBadge = energy > 0.7 ? "Energetic" : energy > 0.4 ? "Moderate " : "Calm";

              return (
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
                    <Flex gap="2">
                      <Badge color="yellow" radius="large">
                        {valenceBadge}
                      </Badge>
                      <Badge color="blue" radius="large">
                        {energyBadge}
                      </Badge>
                      <Badge color="iris" radius="large">
                        {danceabilityBadge}
                      </Badge>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
        <div className="flex flex-col justify-center items-center" id="downloadSection">
          <div className="h-72">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getChartData(data: any): any {
  if (!data || !data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
    return;
  }

  const valences = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.valence);
  const energies = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.energy);
  const danceabilities = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.danceability);
  const tempos = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.tempo);
  const loudnesses = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.loudness);
  const acousticnesses = data.tracks.items
    .filter((item: any) => item.audioFeatures) 
    .map((item: any) => item.audioFeatures.acousticness);

  const normalizedTempos = normalize(tempos);
  const normalizedLoudnesses = normalize(loudnesses);

  const averageValence =
    valences.reduce((a: any, b: any) => a + b) / valences.length;
  const averageEnergy =
    energies.reduce((a: any, b: any) => a + b) / energies.length;
  const averageDanceability =
    danceabilities.reduce((a: any, b: any) => a + b) / danceabilities.length;
  const averageNormalizedTempo =
    normalizedTempos.reduce((a: any, b: any) => a + b) /
    normalizedTempos.length;
  const averageNormalizedLoudness =
    normalizedLoudnesses.reduce((a: any, b: any) => a + b) / normalizedLoudnesses.length;
  const averageAcousticness =
    acousticnesses.reduce((a: any, b: any) => a + b) / acousticnesses.length;

  const moodScore =
    0.4 * averageValence +
    0.25 * averageEnergy +
    0.15 * averageDanceability +
    0.1 * averageNormalizedTempo +
    0.05 * averageNormalizedLoudness +
    0.05 * averageAcousticness;

  return {
    labels: [
      "Valence",
      "Energy",
      "Danceability",
      "Tempo",
      "Loudness",
      "Acousticness",
    ],
    datasets: [
      {
        label: "",
        data: [
          averageValence * 100,
          averageEnergy * 100,
          averageDanceability * 100,
          averageNormalizedTempo * 100,
          averageNormalizedLoudness * 100,
          averageAcousticness * 100,
        ],
        backgroundColor: [
          "rgb(253, 222, 85)",
          "rgb(58, 166, 185)",
          "rgb(137, 138, 217)",
          "rgb(13, 124, 102)",
          "rgb(219, 83, 117)",
          "rgb(202, 230, 178)"
        ],
        hoverOffset: 2,
      },
    ],
  };
}

function normalize(values: number[]) {
  const min = _.min(values) as number;
  const max = _.max(values) as number;
  const normalizedValues = values.map(
    (value: number) => (value - min) / (max - min)
  );
  return normalizedValues;
}

function getMinMax(values: number[]): [number, number] {
  const min = _.min(values) as number;
  const max = _.max(values) as number;
  return [min, max];
}
