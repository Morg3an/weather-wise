export interface CurrentWeatherData {
  city: string;
  country: string;
  date: string; 
  temperature: number; // Celsius
  feelsLike: number; // Celsius
  condition: string; // e.g., "Clear", "Clouds"
  description: string; // e.g., "clear sky", "few clouds"
  icon: string; // OpenWeatherMap icon code
  humidity: number; // %
  windSpeed: number; // km/h
  // This field is for the AI, derived from condition
  precipitationSummary: 'none' | 'rain' | 'snow' | 'light rain' | 'heavy rain'; 
}

export interface ForecastDayData {
  date: string;
  tempMin: number; // Celsius
  tempMax: number; // Celsius
  condition: string;
  description: string;
  icon: string;
}

export interface FiveDayForecastData {
  daily: ForecastDayData[];
}

export interface ActivitySuggestion {
  activity: string;
  reason: string;
}

// For OpenWeatherMap API response structure (simplified)
export interface OpenWeatherCurrentResponse {
  name: string;
  sys: { country: string };
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number; // m/s
  };
}

export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}
