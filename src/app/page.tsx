"use client";

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import type { CurrentWeatherData, ForecastDayData, OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from '@/lib/types';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { FiveDayForecast } from '@/components/weather/FiveDayForecast';
import { ActivitySuggestionCard } from '@/components/weather/ActivitySuggestionCard';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

// Mock API base URL - in a real app, this would be your Laravel backend URL
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
// IMPORTANT: Never embed API keys in frontend code in a real application.
// This key is for demonstration with OpenWeatherMap.
// The prompt implies a Laravel backend would handle the API key.
// For this frontend-only task, we'll use a placeholder or direct call for simplicity.
// Ideally, the Next.js app would have API routes that call the Laravel backend,
// and Laravel would call OpenWeatherMap.
const MOCK_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your key if testing direct calls

export default function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDayData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // ---- Data Transformation Functions ----
  const transformCurrentWeatherData = (data: OpenWeatherCurrentResponse): CurrentWeatherData => {
    const weather = data.weather[0];
    let precipitationSummary: CurrentWeatherData['precipitationSummary'] = 'none';
    if (weather.main.toLowerCase().includes('rain')) precipitationSummary = 'rain';
    else if (weather.main.toLowerCase().includes('snow')) precipitationSummary = 'snow';
    else if (weather.main.toLowerCase().includes('drizzle')) precipitationSummary = 'light rain';

    return {
      city: data.name,
      country: data.sys.country,
      date: format(new Date(data.dt * 1000), 'EEEE, MMMM d, yyyy'),
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      condition: weather.main,
      description: weather.description,
      icon: weather.icon,
      humidity: data.main.humidity,
      windSpeed: parseFloat((data.wind.speed * 3.6).toFixed(1)), // m/s to km/h
      precipitationSummary,
    };
  };

  const transformForecastData = (data: OpenWeatherForecastResponse): ForecastDayData[] => {
    const dailyData: { [key: string]: { temps: number[], icons: string[], conditions: string[], descriptions: string[] } } = {};
    
    data.list.forEach(item => {
      const dateStr = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { temps: [], icons: [], conditions: [], descriptions: [] };
      }
      dailyData[dateStr].temps.push(item.main.temp_min, item.main.temp_max);
      dailyData[dateStr].icons.push(item.weather[0].icon);
      dailyData[dateStr].conditions.push(item.weather[0].main);
      dailyData[dateStr].descriptions.push(item.weather[0].description);
    });

    return Object.entries(dailyData).slice(0, 5).map(([dateStr, dayData]) => {
      const mostCommonIcon = dayData.icons.sort((a,b) => dayData.icons.filter(v => v===a).length - dayData.icons.filter(v => v===b).length).pop() || '01d';
      const mostCommonCondition = dayData.conditions.sort((a,b) => dayData.conditions.filter(v => v===a).length - dayData.conditions.filter(v => v===b).length).pop() || 'Clear';
      const mostCommonDescription = dayData.descriptions.sort((a,b) => dayData.descriptions.filter(v => v===a).length - dayData.descriptions.filter(v => v===b).length).pop() || 'clear sky';
      
      return {
        date: format(new Date(dateStr), 'EEE, MMM d'),
        tempMin: Math.min(...dayData.temps),
        tempMax: Math.max(...dayData.temps),
        condition: mostCommonCondition,
        description: mostCommonDescription,
        icon: mostCommonIcon,
      };
    });
  };

  // ---- API Fetching ----
  const fetchWeatherData = useCallback(async (query: string | { lat: number; lon: number }) => {
    if (MOCK_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" && typeof query === 'string' && query !== 'london') {
       toast({title: "API Key Needed", description: "Please add your OpenWeatherMap API key in src/app/page.tsx to test live data.", variant: "destructive"});
    }

    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast(null);

    // --- Mock Data ---
    const mockCurrent: OpenWeatherCurrentResponse = {
      name: typeof query === 'string' ? query : 'Current Location',
      sys: { country: 'GB' },
      dt: Date.now() / 1000,
      main: { temp: 15, feels_like: 14, humidity: 70 },
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
      wind: { speed: 5 }, // m/s
    };
    const mockForecast: OpenWeatherForecastResponse = {
      list: Array(40).fill(0).map((_, i) => ({
        dt: (Date.now() / 1000) + (i * 3 * 3600), // every 3 hours
        main: { temp_min: 10 + (i % 5), temp_max: 18 + (i % 5) },
        weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
      })),
    };
    // --- End Mock Data ---
    
    try {
      let currentUrl: string, forecastUrl: string;
      if (typeof query === 'string') {
        currentUrl = `${API_BASE_URL}/weather?q=${query}&appid=${MOCK_API_KEY}&units=metric`;
        forecastUrl = `${API_BASE_URL}/forecast?q=${query}&appid=${MOCK_API_KEY}&units=metric`;
      } else {
        currentUrl = `${API_BASE_URL}/weather?lat=${query.lat}&lon=${query.lon}&appid=${MOCK_API_KEY}&units=metric`;
        forecastUrl = `${API_BASE_URL}/forecast?lat=${query.lat}&lon=${query.lon}&appid=${MOCK_API_KEY}&units=metric`;
      }
      
      // Replace with actual fetch if API key is provided and not using mock data.
      // For now, using mock data to avoid needing an API key for the scaffold.
      // This behavior can be toggled if a real API key is available.
      let currentData: OpenWeatherCurrentResponse = mockCurrent;
      let forecastData: OpenWeatherForecastResponse = mockForecast;

      if (MOCK_API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY" && query !== 'london') { // Example: allow real fetch for London, or if key is set
        const [currentRes, forecastRes] = await Promise.all([
          fetch(currentUrl),
          fetch(forecastUrl),
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
          const currentError = !currentRes.ok ? await currentRes.json() : null;
          const forecastError = !forecastRes.ok ? await forecastRes.json() : null;
          const errorMsg = currentError?.message || forecastError?.message || "Failed to fetch weather data";
          throw new Error(errorMsg);
        }
        currentData = await currentRes.json();
        forecastData = await forecastRes.json();
      } else {
        // Simulate network delay for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
         if (typeof query === 'string') mockCurrent.name = query;
      }
      
      setCurrentWeather(transformCurrentWeatherData(currentData));
      setForecast(transformForecastData(forecastData));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
      setGeolocationLoading(false);
    }
  }, [toast]);


  const handleSearch = (location: string) => {
    fetchWeatherData(location);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      toast({ title: "Geolocation Error", description: "Geolocation is not supported by your browser.", variant: "destructive" });
      return;
    }
    setGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      () => {
        setError("Unable to retrieve your location. Please search manually or check browser permissions.");
        toast({ title: "Geolocation Error", description: "Unable to retrieve your location.", variant: "destructive" });
        setGeolocationLoading(false);
      }
    );
  };

  useEffect(() => {
    // Fetch weather for a default location on initial load, e.g., London
    // Or try geolocation if preferred as default. For now, explicit action for geolocation.
    fetchWeatherData("london");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch once on mount for default location

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary mb-2">WeatherWise</h1>
        <p className="text-lg text-muted-foreground">Your intelligent weather companion</p>
      </header>

      <main className="w-full max-w-3xl flex flex-col items-center space-y-8">
        <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} loading={loading} geolocationLoading={geolocationLoading} />

        {loading && !geolocationLoading && (
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-destructive text-center p-4 border border-destructive rounded-md bg-destructive/10">
            <p>Error: {error}</p>
            <p>Please try searching again or check your connection.</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <CurrentWeatherCard data={currentWeather} />
            <FiveDayForecast data={forecast} />
            <ActivitySuggestionCard currentWeather={currentWeather} />
          </>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WeatherWise. Powered by AI.</p>
      </footer>
    </div>
  );
}
