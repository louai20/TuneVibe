"use client";
import { Flex, Table, Badge, Avatar } from '@radix-ui/themes';
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, ArcElement, Legend } from "chart.js";

ChartJS.register(Tooltip, ArcElement, Legend);

export default function MoodChart({ data }: any) {

    const chartData = getChartData(data);

    return (
            <div>
                <h2 className="text-center text-xl font-semibold m-4">{data?.description}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                    <Table.Root size="1" className='h-72'>
                        <Table.Body>

                                {data.tracks.items.map((item: any, index:any) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                        <Avatar src={item.track.album.images[2].url} size="1" fallback="A" radius="large" />
                                        </Table.Cell>
                                        <Table.Cell>{item.track.name}</Table.Cell>
                                        <Table.Cell>
                                            <Flex gap="1">
                                                <Badge color="green" radius="large">Danceability {Math.round((data.audioFeatures[index].danceability)*100)}%</Badge>
                                                    <Badge color="yellow" radius="large">Liveness {Math.round((data.audioFeatures[index].liveness)*100)}%</Badge>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table.Root>

                    <div className="flex flex-col justify-center items-center">
                        <div className='h-72'>
                            <Doughnut data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
    );
}

function getChartData(data: any):any {

    if (!data)
        return;

    let danceability = 0;
    let liveness = 0;

    data.audioFeatures.map((item:any, index:any) => {
        danceability += item.danceability;
        liveness += item.liveness;
    }); 

    danceability = (danceability/data.audioFeatures.length) * 100;
    liveness = (liveness/data.audioFeatures.length) * 100;

    let total = danceability + liveness;

    danceability = (danceability / total) * 100;
    liveness = (liveness / total) * 100;

    const chartData = {
        labels: [
          'Danceability',
          'Liveness',
        ],
        datasets: [{
          data: [danceability, liveness],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 2
        }]
      };

      return chartData;
}