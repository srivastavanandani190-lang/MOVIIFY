// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized movie recommendation AI agent.
 *
 * - getPersonalizedRecommendations - A function that handles the personalized movie recommendation process.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  moviePreferences: z
    .string()
    .describe('The user movie preferences, including genres, actors, directors.'),
  viewingHistory: z
    .string()
    .describe('The user viewing history, including movies watched and ratings.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  movieRecommendation: z.string().describe('The recommended movie.'),
  explanation: z.string().describe('The explanation of why the movie would be of interest to the user based on their preferences and viewing history.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert movie recommender. Based on the user's movie preferences and viewing history, recommend a movie and explain why the movie would be of interest to the user.

Movie Preferences: {{{moviePreferences}}}
Viewing History: {{{viewingHistory}}}

Movie Recommendation:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
