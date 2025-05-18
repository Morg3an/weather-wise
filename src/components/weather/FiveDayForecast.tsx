"use client";

import type { ForecastDayData } from "@/lib/types";
import { ForecastItem } from "./ForecastItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FiveDayForecastProps {
  data: ForecastDayData[] | null;
}

export const FiveDayForecast: React.FC<FiveDayForecastProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null; // Or a placeholder card
  }

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((day) => (
            <ForecastItem key={day.date} data={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
