import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TripInput } from '../types/trip';
import type { Itinerary } from '../types/itinerary';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  }
});

export async function generateItinerary(
  input: TripInput,
  onProgress?: (text: string) => void
): Promise<Itinerary> {
  const checkInDate = input.checkIn ? new Date(input.checkIn) : new Date();
  const checkOutDate = input.checkOut ? new Date(input.checkOut) : new Date();
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const prompt = `You are a professional travel planner. Create a detailed ${nights}-day trip itinerary for ${input.travelers} traveler(s) to ${input.destination}.

Trip Details:
- Destination: ${input.destination}
- Check-in: ${checkInDate.toLocaleDateString()}
- Check-out: ${checkOutDate.toLocaleDateString()}
- Number of Travelers: ${input.travelers}
- Budget: $${input.budget}
- Preferences: ${input.preferences.activities || 'general sightseeing'}, ${input.preferences.hotelType || 'mid-range hotel'}, ${input.preferences.foodPreferences || 'varied cuisine'}

Please generate a complete itinerary in JSON format with:
1. Outbound and return flights with realistic prices, times, and airlines
2. Hotel recommendation with nightly rate and amenities
3. Day-by-day plans with morning/afternoon/evening activities
4. Restaurant recommendations for each meal
5. All prices should total close to (but not exceed) the budget

Return ONLY valid JSON matching this structure:
{
  "destination": string,
  "flights": [
    {
      "type": "outbound" | "return",
      "airline": string,
      "flightNumber": string,
      "departure": { "airport": string, "time": "HH:MM" },
      "arrival": { "airport": string, "time": "HH:MM" },
      "price": number,
      "duration": string
    }
  ],
  "hotel": {
    "name": string,
    "rating": number (1-5),
    "checkIn": "YYYY-MM-DD",
    "checkOut": "YYYY-MM-DD",
    "pricePerNight": number,
    "totalPrice": number,
    "amenities": string[]
  },
  "dailyPlans": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "morning" | "afternoon" | "evening",
          "name": string,
          "description": string,
          "duration": string,
          "price": number
        }
      ],
      "restaurants": [
        {
          "meal": "breakfast" | "lunch" | "dinner",
          "name": string,
          "cuisine": string,
          "priceRange": string,
          "estimatedCost": number
        }
      ]
    }
  ],
  "totalCost": number,
  "budgetStatus": "under" | "over" | "exact"
}`;

  try {
    const result = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;

      if (onProgress) {
        onProgress(fullText);
      }
    }

    let jsonString = fullText;

    const codeBlockMatch = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    } else {
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
    }

    let cleanedJson = jsonString
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/,(\s*,)/g, ',')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    try {
      const itinerary: Itinerary = JSON.parse(cleanedJson);
      return itinerary;
    } catch (parseError) {
      try {
        const superCleanedJson = cleanedJson
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');

        const itinerary: Itinerary = JSON.parse(superCleanedJson);
        return itinerary;
      } catch (secondError) {
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    throw error;
  }
}
