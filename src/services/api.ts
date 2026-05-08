import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TripInput } from '../types/trip';
import type { Itinerary } from '../types/itinerary';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096,
  }
});

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
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

  console.log('Sending prompt to Gemini API...');

  try {
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out after 60 seconds')), 60000);
    });

    const apiPromise = model.generateContent(prompt);

    const result = await Promise.race([apiPromise, timeoutPromise]) as any;
    console.log('Received response from Gemini API');

    const response = result.response;
    const responseText = response.text();
    console.log('Response text length:', responseText.length);
    console.log('First 200 chars:', responseText.substring(0, 200));

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || responseText.match(/(\{[\s\S]*\})/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;

    console.log('Extracted JSON length:', jsonString.length);
    const itinerary: Itinerary = JSON.parse(jsonString);
    console.log('Successfully parsed itinerary:', itinerary);

    return itinerary;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}
