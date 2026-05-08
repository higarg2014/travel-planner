export interface TripInput {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  travelers: number;
  budget: number;
  preferences: {
    activities: string;
    hotelType: string;
    foodPreferences: string;
  };
}
