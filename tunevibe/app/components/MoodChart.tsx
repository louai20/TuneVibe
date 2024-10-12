"use client";

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
ChartJS.register(
  Tooltip,
  ArcElement,
  Legend,
  RadialLinearScale,
  LineElement,
  BarElement,
  CategoryScale
);
import _ from "lodash";

export default function MoodChart({ data }: any) {
  // Return early if data is not available
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

  // Return early if chartData is not valid
  if (!chartData) {
    return <div className="text-center">Unable to generate chart</div>;
  }

  const [chartType, setChartType] = useState("bar");

  useEffect(() => {});

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
                    <Badge color="iris" radius="large">
                      Danceability{" "}
                      {
                        item.audioFeatures && item.audioFeatures.danceability
                          ? Math.round(item.audioFeatures.danceability * 100)
                          : 0 // Default to 0 or any other value you prefer
                      }
                      %
                    </Badge>
                    <Badge color="yellow" radius="large">
                      Valence{" "}
                      {
                        item.audioFeatures && item.audioFeatures.valence
                          ? Math.round(item.audioFeatures.valence * 100)
                          : 0 // Default to 0 or any other value you prefer
                      }
                      %
                    </Badge>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <div
          className="flex flex-col justify-center items-center"
          id="downloadSection"
        >
          <div className="h-72">
            <Bar data={chartData} options={options} />
          </div>
        </div>
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

  const valences = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
    .map((item: any) => item.audioFeatures.valence);
  const energies = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
    .map((item: any) => item.audioFeatures.energy);
  const danceabilities = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
    .map((item: any) => item.audioFeatures.danceability);
  const tempos = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
    .map((item: any) => item.audioFeatures.tempo);
  const loudnesses = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
    .map((item: any) => item.audioFeatures.loudness);
  const acousticnesses = data.tracks.items
    .filter((item: any) => item.audioFeatures) // Filter out items without audioFeatures
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
    normalizedLoudnesses.reduce((a: any, b: any) => a + b) /
    normalizedLoudnesses.length;
  const averageAcousticness =
    acousticnesses.reduce((a: any, b: any) => a + b) / acousticnesses.length;

  const moodScore =
      (0.40 * averageValence) +
      (0.25 * averageEnergy) +
      (0.15 * averageDanceability) +
      (0.10 * averageNormalizedTempo) +
      (0.05 * averageNormalizedLoudness) +
      (0.05 * averageAcousticness);

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
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 99, 5)",
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
