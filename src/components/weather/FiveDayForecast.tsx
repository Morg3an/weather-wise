"use client";

import type { WeatherSlice } from "@/lib/types";
import { ForecastItem } from "./ForecastItem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface Props {
  /** Array of forecast slices (usually 40 entries) */
  data: WeatherSlice[] | null;
}

export const FiveDayForecast: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Filter out any incomplete entries
  const validData = data.filter(
    (slice) =>
      typeof slice.timestamp === "number" &&
      typeof slice.temp === "number" &&
      typeof slice.feelsLike === "number" &&
      typeof slice.summary === "string" &&
      typeof slice.icon === "string"
  );

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Forecast</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {validData.map((slice) => (
            <ForecastItem key={slice.timestamp} data={slice} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};