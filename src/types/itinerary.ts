export interface Flight {
  type: 'outbound' | 'return';
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  price: number;
  duration: string;
}

export interface Hotel {
  name: string;
  rating: number;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
}

export interface Activity {
  time: 'morning' | 'afternoon' | 'evening';
  name: string;
  description: string;
  duration: string;
  price: number;
}

export interface Restaurant {
  meal: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  cuisine: string;
  priceRange: string;
  estimatedCost: number;
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  restaurants: Restaurant[];
}

export interface Itinerary {
  destination: string;
  flights: Flight[];
  hotel: Hotel;
  dailyPlans: DayPlan[];
  totalCost: number;
  budgetStatus: 'under' | 'over' | 'exact';
}
