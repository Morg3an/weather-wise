/* ------------------------------------------------------------------
 *  Shared, app‑wide TypeScript interfaces & utility types
 * ------------------------------------------------------------------ */

/** Basic weather condition returned by OpenWeather / the backend */
export interface WeatherCondition {
  /** e.g. “Rain”, “Clouds” */
  main: string;
  /** Longer text such as “light rain” */
  description: string;
  /** Icon code — see https://openweathermap.org/weather-conditions */
  icon: string;
}

/* ────────────────────────────────────────────────────────────────
 * Current weather slice (used by CurrentWeatherCard, etc.)
 * ──────────────────────────────────────────────────────────────── */

export interface CurrentWeather {
  /** Unix timestamp (seconds) */
  timestamp: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure?: number;
  windSpeed?: number;
  windDeg?: number;
  summary: string;
  icon: string;
  [key: string]: unknown; // allow extra props
}

/* ────────────────────────────────────────────────────────────────
 * Hourly or daily forecast slice (from /weather/forecast)
 * ──────────────────────────────────────────────────────────────── */

export interface WeatherSlice {
  city: string;
  timestamp: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  summary: string;
  icon: string;
  timezone: number;
  [key: string]: unknown;
}

/* ────────────────────────────────────────────────────────────────
 * Laravel API responses
 * ──────────────────────────────────────────────────────────────── */

/** /api/weather/current */
export interface LaravelCurrentResponse {
  data: {
    city: string | null;
    slice: CurrentWeather;
  };
}

/** /api/weather/forecast */
export interface LaravelForecastResponse {
  data: {
    city: string | null;
    slices: WeatherSlice[];
  };
}


/* ────────────────────────────────────────────────────────────────
 * Activity Suggestion types
 * ──────────────────────────────────────────────────────────────── */

/** Input sent to the AI activity suggestion logic */
export interface ActivitySuggestionInput {
  temperature: number;
  condition: string; // e.g. "Clear", "Rain"
  precipitation: string; // e.g. "Light rain", "None"
  windSpeed: number;
}

/** AI-generated activity suggestion */
export interface ActivitySuggestion {
  activity: string; // e.g. "Go for a jog"
  reason: string;   // e.g. "The weather is clear and wind is low"
}

/** Weather data used in the frontend card (mapped from API format) */
export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure?: number;
  windSpeed: number;
  windDeg?: number;
  condition: string;              // e.g. "Rain"
  precipitationSummary: string;  // e.g. "light rain"
  icon: string;
  timestamp: number;
}


/* ------------------------------------------------------------------
 *  Re‑usable front‑end helper types
 * ------------------------------------------------------------------ */

/** Convenience: convert union to intersection (handy for utils) */
export type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends
  (k: infer I) => void ? I : never;

/**
 * Narrow utility, e.g.
 *   const slice = narrow<typeof obj>()({...});
 * Keeps literal types intact when constructing mocks in tests.
 */
export const narrow =
  <T>() =>
  <U extends T>(u: U) =>
    u;