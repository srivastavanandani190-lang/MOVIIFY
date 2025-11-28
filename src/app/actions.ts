'use server';

import { getPersonalizedRecommendations, type PersonalizedRecommendationsInput } from "@/ai/flows/personalized-recommendations";

export async function getRecommendationAction(input: PersonalizedRecommendationsInput) {
    try {
        const result = await getPersonalizedRecommendations(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to get recommendations. Please try again." };
    }
}
