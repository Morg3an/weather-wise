"use client";

import type { WeatherSlice } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";

interface Props {
  /** Single 3‑hour slice from Laravel `/api/weather/forecast` */
  data?: WeatherSlice;
}

export const ForecastItem: React.FC<Props> = ({ data }) => {
  // Guard: skip if no data or incomplete
  if (
    !data ||
    typeof data.timestamp !== "number" ||
    typeof data.temp !== "number" ||
    typeof data.feelsLike !== "number" ||
    !data.icon ||
    !data.summary
  ) {
    return null;
  }

  const { timestamp, temp, feelsLike, icon, summary } = data;

  return (
    <Card className="flex-shrink-0 w-full sm:w-40 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-3 text-center">
        <CardTitle className="text-base font-medium">
          {format(new Date(timestamp * 1000), "EEE, HH:mm")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-2 p-3 pt-0">
        <WeatherIcon iconCode={icon} className="w-12 h-12 text-primary" />
        <p className="text-sm capitalize text-muted-foreground">{summary}</p>

        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center" title="Temp">
            <ArrowUp className="h-3 w-3 text-destructive" />
            <span>{Math.round(temp)}°</span>
          </div>
          <div className="flex items-center" title="Feels like">
            <ArrowDown className="h-3 w-3 text-blue-500" />
            <span>{Math.round(feelsLike)}°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};