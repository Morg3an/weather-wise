// src/ai/flows/activity-suggestion.ts
'use server';
/**
 * @fileOverview Provides personalized outdoor activity suggestions based on weather conditions.
 *
 * - suggestActivity - A function to generate activity suggestions.
 * - ActivitySuggestionInput - The input type for the suggestActivity function.
 * - ActivitySuggestionOutput - The return type for the suggestActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivitySuggestionInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('The current weather condition (e.g., sunny, rainy, cloudy).'),
  precipitation: z.string().describe('The likelihood of precipitation (e.g., none, light, heavy).'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
});
export type ActivitySuggestionInput = z.infer<typeof ActivitySuggestionInputSchema>;

const ActivitySuggestionOutputSchema = z.object({
  activity: z.string().describe('A suggested outdoor activity based on the weather conditions.'),
  reason: z.string().describe('The reason why this activity is suitable for the given weather conditions.'),
});
export type ActivitySuggestionOutput = z.infer<typeof ActivitySuggestionOutputSchema>;

export async function suggestActivity(input: ActivitySuggestionInput): Promise<ActivitySuggestionOutput> {
  return suggestActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'activitySuggestionPrompt',
  input: {schema: ActivitySuggestionInputSchema},
  output: {schema: ActivitySuggestionOutputSchema},
  prompt: `You are an AI assistant that suggests outdoor activities based on the current weather conditions.

  Given the following weather conditions:
  - Temperature: {{temperature}}°C
  - Condition: {{condition}}
  - Precipitation: {{precipitation}}
  - Wind Speed: {{windSpeed}} km/h

  Suggest an outdoor activity and explain why it is suitable for these conditions.
  Consider the temperature, condition, precipitation, and wind speed when making your suggestion.
  Format your response as a JSON object with "activity" and "reason" keys.
  `,
});

const suggestActivityFlow = ai.defineFlow(
  {
    name: 'suggestActivityFlow',
    inputSchema: ActivitySuggestionInputSchema,
    outputSchema: ActivitySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
