import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TripInput } from '../types/trip';
import type { Itinerary } from '../types/itinerary';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  }
});

export async function generateItinerary(
  input: TripInput,
  onProgress?: (text: string) => void
): Promise<Itinerary> {
  console.log('Starting API call with input:', input);
  console.log('API Key available:', !!import.meta.env.VITE_GOOGLE_API_KEY);

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

  console.log('Sending prompt to Gemini API with streaming...');

  try {
    const result = await model.generateContentStream(prompt);

    let fullText = '';

    // Stream the response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;

      // Call progress callback with accumulated text
      if (onProgress) {
        onProgress(fullText);
      }
    }

    console.log('Streaming complete. Full response length:', fullText.length);
    console.log('Full response text:', fullText);

    // Extract JSON from response (handle markdown code blocks)
    let jsonString = fullText;

    // Try to extract from markdown code block first
    const codeBlockMatch = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    } else {
      // Try to extract just the JSON object
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
    }

    console.log('Extracted JSON length:', jsonString.length);
    console.log('First 500 chars of JSON:', jsonString.substring(0, 500));

    // Aggressive JSON cleaning
    let cleanedJson = jsonString
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas before } or ]
      .replace(/,(\s*,)/g, ',') // Remove duplicate commas
      .replace(/\n/g, ' ') // Remove newlines
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .trim();

    console.log('Cleaned JSON length:', cleanedJson.length);

    try {
      const itinerary: Itinerary = JSON.parse(cleanedJson);
      console.log('Successfully parsed itinerary:', itinerary);
      return itinerary;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Problematic JSON (first 2000 chars):', cleanedJson.substring(0, 2000));
      console.error('Problematic JSON (around error position 629):', cleanedJson.substring(600, 700));

      // Try one more time with even more aggressive cleaning
      try {
        const superCleanedJson = cleanedJson
          .replace(/,\s*}/g, '}') // Remove trailing commas before }
          .replace(/,\s*]/g, ']'); // Remove trailing commas before ]

        const itinerary: Itinerary = JSON.parse(superCleanedJson);
        console.log('Successfully parsed with super cleaning:', itinerary);
        return itinerary;
      } catch (secondError) {
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}
