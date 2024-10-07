import React, { useState } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { FeatureKey, AudioFeatureKey } from "@/utils/types";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface AudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  valence: number;
}

interface Artist {
  name: string;
  [key: string]: any;
}

interface TrackInfo {
  id: string;
  name: string;
  popularity: number;
  artists: Artist[];
  [key: string]: any;
}

interface PlaylistItem {
  track: TrackInfo;
  audioFeatures: AudioFeatures;
}

interface BubbleChartProps {
  data: PlaylistItem[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const audioFeaturesOptions: FeatureKey[] = [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "liveness",
    "speechiness",
    "valence",
    "popularity",
  ];

  const [xFeature, setXFeature] = useState<FeatureKey>("danceability");
  const [yFeature, setYFeature] = useState<FeatureKey>("energy");
  const [sizeFeature, setSizeFeature] = useState<FeatureKey>("popularity");

  const chartData: ChartData<"bubble"> = {
    datasets: [
      {
        label: "",
        data: data.map((item) => ({
          x:
            xFeature === "popularity"
              ? item.track.popularity
              : item.audioFeatures[xFeature as AudioFeatureKey],
          y:
            yFeature === "popularity"
              ? item.track.popularity
              : item.audioFeatures[yFeature as AudioFeatureKey],
          r:
            sizeFeature === "popularity"
              ? item.track.popularity / 5
              : item.audioFeatures[sizeFeature as AudioFeatureKey] * 10,
        })),
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  const options: ChartOptions<"bubble"> = {
    scales: {
      x: {
        title: {
          display: true,
          text: xFeature,
        },
      },
      y: {
        title: {
          display: true,
          text: yFeature,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const track = data[index];
            return `${track.track.name} by ${track.track.artists
              .map((artist) => artist.name)
              .join(", ")}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Y-Axis</label>
          <select
            value={yFeature}
            onChange={(e) => setYFeature(e.target.value as FeatureKey)}
            className="w-full p-2 border rounded"
          >
            {audioFeaturesOptions.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">X-Axis</label>
          <select
            value={xFeature}
            onChange={(e) => setXFeature(e.target.value as FeatureKey)}
            className="w-full p-2 border rounded"
          >
            {audioFeaturesOptions.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Bubble Size</label>
          <select
            value={sizeFeature}
            onChange={(e) => setSizeFeature(e.target.value as FeatureKey)}
            className="w-full p-2 border rounded"
          >
            {audioFeaturesOptions.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Bubble data={chartData} options={options} />
    </div>
  );
};

export default BubbleChart;
