"use client";

import type { CurrentWeather } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { Thermometer, Droplets, Wind, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface Props {
  /** Slice returned by Laravel `/api/weather/current` */
  data: CurrentWeather | null;
}

export const CurrentWeatherCard: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Search for a location or use geolocation to see the current weather.
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    temp,
    feelsLike,
    humidity,
    windSpeed,
    summary,
    icon,
    timestamp,
  } = data;

  return (
    <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold">
          {/* City/country now come from the parent, so no placeholder */}
        </CardTitle>
        <CardDescription className="text-sm flex items-center">
          <CalendarDays className="mr-2 h-4 w-4" />
          {format(new Date(timestamp * 1000), "EEEE, MMM d, yyyy")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <WeatherIcon
            iconCode={icon}
            className="w-24 h-24 text-primary"
          />
          <div>
            <p className="text-7xl font-bold">{Math.round(temp)}°C</p>
            <p className="text-xl text-muted-foreground capitalize">
              {summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Thermometer className="h-6 w-6 mb-1 text-primary" />
            <p className="text-sm font-medium">Feels&nbsp;Like</p>
            <p className="text-lg">{Math.round(feelsLike)}°C</p>
          </div>

          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Droplets className="h-6 w-6 mb-1 text-primary" />
            <p className="text-sm font-medium">Humidity</p>
            <p className="text-lg">{humidity}%</p>
          </div>

          {typeof windSpeed === "number" && (
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
              <Wind className="h-6 w-6 mb-1 text-primary" />
              <p className="text-sm font-medium">Wind</p>
              <p className="text-lg">{windSpeed.toFixed(1)}&nbsp;km/h</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};