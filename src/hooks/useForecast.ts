import { useState, useEffect } from "react";
import { fetchJson } from "@/lib/api";
import type { LaravelForecastResponse } from "@/lib/types";

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export function useForecast(city: string | undefined) {
  const [forecast, setForecast] = useState<LaravelForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    setError(null);

    fetchJson<LaravelForecastResponse>(`${api}/weather/forecast?city=${encodeURIComponent(city)}`)
      .then(setForecast)
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [city]);

  return { forecast, loading, error };
}