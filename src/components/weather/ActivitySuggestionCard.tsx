"use client";

import { useState } from 'react';
import type { CurrentWeatherData, ActivitySuggestion as ActivitySuggestionType } from "@/lib/types";
import { suggestActivity, type ActivitySuggestionInput } from "@/ai/flows/activity-suggestion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActivitySuggestionCardProps {
  currentWeather: CurrentWeatherData | null;
}

export const ActivitySuggestionCard: React.FC<ActivitySuggestionCardProps> = ({ currentWeather }) => {
  const [suggestion, setSuggestion] = useState<ActivitySuggestionType | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestActivity = async () => {
    if (!currentWeather) {
      toast({
        title: "Weather data unavailable",
        description: "Cannot suggest activities without current weather information.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSuggestion(null);

    try {
      const aiInput: ActivitySuggestionInput = {
        temperature: currentWeather.temperature,
        condition: currentWeather.condition, // e.g., "Clear", "Rain"
        precipitation: currentWeather.precipitationSummary, // Use derived summary
        windSpeed: currentWeather.windSpeed,
      };
      const result = await suggestActivity(aiInput);
      setSuggestion(result);
    } catch (error) {
      console.error("Error fetching activity suggestion:", error);
      toast({
        title: "Suggestion Error",
        description: "Could not fetch activity suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentWeather) {
    return null; // Don't show card if no current weather
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-primary" />
          Activity Suggestions
        </CardTitle>
        <CardDescription>Let AI help you plan your day based on the weather!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleSuggestActivity} disabled={loading || !currentWeather} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Suggest Activities
        </Button>
        {loading && (
          <div className="text-center text-muted-foreground">
            <p>Thinking of some fun activities...</p>
          </div>
        )}
        {suggestion && !loading && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
            <h4 className="font-semibold text-lg text-primary">{suggestion.activity}</h4>
            <p className="text-sm text-foreground/80">{suggestion.reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
