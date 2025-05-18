"use client";

import type { CurrentWeatherData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { Thermometer, Droplets, Wind, CalendarDays } from "lucide-react";

interface CurrentWeatherCardProps {
  data: CurrentWeatherData | null;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Search for a location or use geolocation to see the current weather.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold">{data.city}, {data.country}</CardTitle>
        <CardDescription className="text-sm flex items-center">
          <CalendarDays className="mr-2 h-4 w-4" /> {data.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <WeatherIcon iconCode={data.icon} className="w-24 h-24 text-primary" />
          <div>
            <p className="text-7xl font-bold">{Math.round(data.temperature)}°C</p>
            <p className="text-xl text-muted-foreground capitalize">{data.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Thermometer className="h-6 w-6 mb-1 text-primary" />
            <p className="text-sm font-medium">Feels Like</p>
            <p className="text-lg">{Math.round(data.feelsLike)}°C</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Droplets className="h-6 w-6 mb-1 text-primary" />
            <p className="text-sm font-medium">Humidity</p>
            <p className="text-lg">{data.humidity}%</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Wind className="h-6 w-6 mb-1 text-primary" />
            <p className="text-sm font-medium">Wind</p>
            <p className="text-lg">{data.windSpeed.toFixed(1)} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
