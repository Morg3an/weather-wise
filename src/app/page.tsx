/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import type {
  CurrentWeather,
  WeatherSlice,
  LaravelCurrentResponse,
  LaravelForecastResponse,
} from "@/lib/types";

import { SearchBar } from "@/components/weather/SearchBar";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { FiveDayForecast } from "@/components/weather/FiveDayForecast";
import { ActivitySuggestionCard } from "@/components/weather/ActivitySuggestionCard";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface CurrentWeatherData {
  city: string | null;
  date: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  condition: string;
  precipitationSummary: string;
  timestamp: number;
}

const toFriendlyCurrent = (
  slice: CurrentWeather | null | undefined,
  city: string | null
): CurrentWeatherData | null => {
  if (!slice || slice.timestamp == null) return null;

  return {
    city,
    date: format(new Date(slice.timestamp * 1000), "EEEE, MMM d"),
    temperature: slice.temp,
    feelsLike: slice.feelsLike,
    description: slice.summary ?? "Unknown conditions",
    icon: slice.icon ?? "01d",
    humidity: slice.humidity ?? 0,
    windSpeed: slice.windSpeed ?? 0,
    condition: typeof slice.condition === "string"
      ? slice.condition
      : slice.summary ?? "Unknown",
    precipitationSummary: typeof slice.precipitationSummary === "string"
      ? slice.precipitationSummary
      : "None",
    timestamp: slice.timestamp,
  };
};

export default function WeatherPage() {
  const [currentRaw, setCurrentRaw] = useState<CurrentWeather | null>(null);
  const [forecastRaw, setForecastRaw] = useState<WeatherSlice[] | null>(null);
  const [currentFriendly, setCurrentFriendly] =
    useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchWeatherData = useCallback(
    async (query: string | { lat: number; lon: number }) => {
      setLoading(true);
      setError(null);

      try {
        const qs =
          typeof query === "string"
            ? `city=${encodeURIComponent(query)}`
            : `lat=${query.lat}&lon=${query.lon}`;

        const [currRes, fcRes] = await Promise.all([
          fetch(`${BACKEND_BASE_URL}/api/weather/current?${qs}`),
          fetch(`${BACKEND_BASE_URL}/api/weather/forecast?${qs}`),
        ]);

        if (!currRes.ok || !fcRes.ok) {
          throw new Error(`Request failed (${currRes.status}/${fcRes.status})`);
        }

        const currJson: LaravelCurrentResponse = await currRes.json();
        const fcJson: LaravelForecastResponse = await fcRes.json();

        console.log("Full current weather response:", currJson);
        console.log("Full forecast weather response:", fcJson);

        const currSlice = currJson.data?.slice ?? null;

        if (!currSlice || currSlice.timestamp == null) {
          throw new Error("Current weather payload missing timestamp.");
        }

        const fcSlicesRaw = fcJson.data?.slices ?? null;
        console.log("Raw slice entries:", fcSlicesRaw);
        console.log("Raw forecast entries (fcJson.data.slices):", fcJson.data?.slices);

        console.log("Type of forecast slices:", typeof fcJson.data?.slices);

        const flattenedSlices: WeatherSlice[] | null = Array.isArray(fcSlicesRaw)
          ? fcSlicesRaw.flatMap((entry: unknown, index: number) => {
            console.log(`Entry [${index}]:`, entry);

            if (
              typeof entry === "object" &&
              entry !== null &&
              "data" in entry &&
              typeof (entry as any).data === "object" &&
              (entry as any).data !== null &&
              "slice" in (entry as any).data
            ) {
              const rawSlice = (entry as any).data.slice;
              console.log(`  rawSlice [${index}]:`, rawSlice);

              if (
                typeof rawSlice === "object" &&
                rawSlice !== null &&
                typeof rawSlice.timestamp === "number" &&
                typeof rawSlice.temp === "number"
              ) {
                return [rawSlice as WeatherSlice];
              } else {
                console.warn(`  Skipped invalid slice at index ${index}`);
              }
            }

            return [];
          })
          : null;

        console.log("Flattened forecast slices:", flattenedSlices);




        setCurrentRaw(currSlice);
        setForecastRaw(flattenedSlices);
        setCurrentFriendly(toFriendlyCurrent(currSlice, currJson.data.city));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        setCurrentRaw(null);
        setForecastRaw(null);
        setCurrentFriendly(null);
      } finally {
        setLoading(false);
        setGeoLoading(false);
      }
    },
    [toast]
  );


  const handleSearch = (location: string) => fetchWeatherData(location);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation isn’t supported by your browser.",
        variant: "destructive",
      });
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchWeatherData({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => {
        toast({
          title: "Geolocation Error",
          description: "Unable to retrieve location. Please search manually.",
          variant: "destructive",
        });
        setGeoLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWeatherData("London");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary mb-2">WeatherWise</h1>
        <p className="text-lg text-muted-foreground">
          Your intelligent weather companion
        </p>
      </header>

      <main className="w-full max-w-3xl flex flex-col items-center space-y-8">
        <SearchBar
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          loading={loading}
          geolocationLoading={geoLoading}
        />

        {loading && (
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-destructive text-center p-4 border border-destructive rounded-md bg-destructive/10">
            <p>Error: {error}</p>
            <p>Please try again or check your connection.</p>
          </div>
        )}

        {!loading && !error && currentRaw && forecastRaw && (
          <>
            <CurrentWeatherCard data={currentRaw} />
            <FiveDayForecast data={forecastRaw} />
            {currentFriendly && (
              <ActivitySuggestionCard currentWeather={currentFriendly} />
            )}
          </>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} WeatherWise. Made by Keath Morgan.
        </p>
      </footer>
    </div>
  );
}