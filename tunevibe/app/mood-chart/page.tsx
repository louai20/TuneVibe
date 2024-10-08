"use client";
import { Flex, Table, Badge, Avatar, Box, Text } from "@radix-ui/themes";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, ArcElement, Legend } from "chart.js";

ChartJS.register(Tooltip, ArcElement, Legend);

export default function MoodChart({ data }: any) {
  console.log(data); // Inspect data structure

  // Return early if data is not available
  if (!data || !data.tracks || !data.tracks.items) {
    return <div className="text-center">No data available</div>;
  }

  const chartData = getChartData(data);

  // Return early if chartData is not valid
  if (!chartData) {
    return <div className="text-center">Unable to generate chart</div>;
  }

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
                      src={item.track.album.images[2]?.url} // Use optional chaining
                      size="1"
                      fallback="A"
                      radius="large"
                    />
                    <Box>
                      <Text as="div" size="1" weight="bold">
                        {item.track.name}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        {item.track.artists[0]?.name} // Use optional chaining
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
                      Liveness {Math.round(item.audioFeatures.liveness * 100)}%
                    </Badge>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <div className="flex flex-col justify-center items-center">
          <div className="h-72">
            <Doughnut data={chartData} />
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

  let danceability = 0;
  let liveness = 0;

  data.tracks.items.forEach((item: any) => {
    danceability += item.audioFeatures.danceability;
    liveness += item.audioFeatures.liveness;
  });

  danceability = (danceability / data.tracks.items.length) * 100;
  liveness = (liveness / data.tracks.items.length) * 100;

  const total = danceability + liveness;

  if (total === 0) return; // Avoid division by zero

  danceability = (danceability / total) * 100;
  liveness = (liveness / total) * 100;

  return {
    labels: ["Danceability", "Liveness"],
    datasets: [
      {
        data: [danceability, liveness],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 2,
      },
    ],
  };
}
