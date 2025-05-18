"use client";

import type { ForecastDayData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ForecastItemProps {
  data: ForecastDayData;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({ data }) => {
  return (
    <Card className="flex-shrink-0 w-full sm:w-40 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-3 text-center">
        <CardTitle className="text-base font-medium">{data.date}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-2 p-3 pt-0">
        <WeatherIcon iconCode={data.icon} className="w-12 h-12 text-primary" />
        <p className="text-sm capitalize text-muted-foreground">{data.description}</p>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center" title="Max temperature">
            <ArrowUp className="h-3 w-3 text-destructive" /> 
            <span>{Math.round(data.tempMax)}°</span>
          </div>
          <div className="flex items-center" title="Min temperature">
            <ArrowDown className="h-3 w-3 text-blue-500" />
            <span>{Math.round(data.tempMin)}°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
