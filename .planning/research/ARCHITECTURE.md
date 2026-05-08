# Architecture Research

**Domain:** Travel Planning and Itinerary Builder
**Researched:** 2026-05-08
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER (React)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Search  │  │Selection │  │Itinerary │  │ Export  │   │
│  │Components│  │ Wizard   │  │ Review   │  │  Flow   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
├───────┴─────────────┴─────────────┴─────────────┴──────────┤
│              STATE MANAGEMENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Itinerary    │  │ Travel Data  │  │  UI State    │     │
│  │ Reducer +    │  │ Cache        │  │  (Context)   │     │
│  │ Context      │  │ (TanStack)   │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
│         │                  │                                │
├─────────┴──────────────────┴────────────────────────────────┤
│                      API LAYER (Node.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Flights  │  │ Hotels   │  │  Cars    │  │Activities│   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                          │                                   │
│                   ┌──────┴──────┐                           │
│                   │   Pricing   │                           │
│                   │  Aggregator │                           │
│                   └──────┬──────┘                           │
│                          │                                   │
├──────────────────────────┴───────────────────────────────────┤
│                     DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Firestore / Cloud SQL                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │Itineraries│  │Mock Data │  │ User Preferences │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Search Components** | Filter/search travel options within each category | React components with form state, useReducer for complex filters |
| **Selection Wizard** | Step-by-step travel component selection flow | Multi-step form with useReducer + Context, step validation, navigation controls |
| **Itinerary Review** | Display complete trip with pricing breakdown | Read-only normalized state display, price aggregation calculations |
| **Export Flow** | Generate shareable/printable itinerary formats | PDF generation (server-side), calendar integration, email composition |
| **Travel Data Cache** | Client-side caching of API responses | TanStack Query for automatic caching, refetching, and cache invalidation |
| **Itinerary Reducer** | Manage itinerary construction state | useReducer with actions for ADD_FLIGHT, UPDATE_HOTEL, REMOVE_ACTIVITY, etc. |
| **Service Layer** | Backend API routes for each travel type | Express.js routes organized by domain (flights, hotels, cars, activities) |
| **Pricing Aggregator** | Calculate total costs, apply discounts | Backend service that sums component prices, applies business rules |
| **Data Layer** | Persist user itineraries and mock data | Firestore for document-based itinerary storage, Cloud SQL for structured data if needed |

## Recommended Project Structure

### Frontend (React)

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Buttons, Cards, Inputs
│   │   ├── search/           # Search interfaces for each travel type
│   │   │   ├── FlightSearch.jsx
│   │   │   ├── HotelSearch.jsx
│   │   │   ├── CarSearch.jsx
│   │   │   └── ActivitySearch.jsx
│   │   ├── selection/        # Selection cards and comparison views
│   │   │   ├── FlightCard.jsx
│   │   │   ├── ComparisonTable.jsx
│   │   │   └── PriceBreakdown.jsx
│   │   └── itinerary/        # Itinerary display and management
│   │       ├── ItinerarySummary.jsx
│   │       ├── ItineraryTimeline.jsx
│   │       └── BudgetTracker.jsx
│   ├── features/             # Feature-based organization (vertical slices)
│   │   ├── flights/          # Flight selection feature
│   │   │   ├── FlightWizard.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useFlightSearch.js
│   │   │   └── api/
│   │   │       └── flightsApi.js
│   │   ├── hotels/           # Hotel selection feature
│   │   ├── activities/       # Activity selection feature
│   │   └── export/           # Export feature
│   │       ├── ExportDialog.jsx
│   │       └── exportUtils.js
│   ├── state/                # State management
│   │   ├── itinerary/
│   │   │   ├── ItineraryContext.jsx
│   │   │   ├── itineraryReducer.js
│   │   │   └── itineraryActions.js
│   │   └── queryClient.js    # TanStack Query configuration
│   ├── pages/                # Page-level components (routing)
│   │   ├── HomePage.jsx
│   │   ├── WizardPage.jsx
│   │   ├── ReviewPage.jsx
│   │   └── ExportPage.jsx
│   ├── hooks/                # Shared custom hooks
│   │   ├── useTravelSearch.js
│   │   └── usePriceCalculation.js
│   ├── utils/                # Utility functions
│   │   ├── dateUtils.js
│   │   ├── priceFormatters.js
│   │   └── validation.js
│   └── api/                  # API client configuration
│       └── client.js
└── public/
```

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── routes/               # Express route definitions
│   │   ├── flights.js
│   │   ├── hotels.js
│   │   ├── cars.js
│   │   ├── activities.js
│   │   └── itineraries.js
│   ├── services/             # Business logic layer
│   │   ├── flights/
│   │   │   ├── flightService.js
│   │   │   └── flightMockData.js
│   │   ├── hotels/
│   │   │   ├── hotelService.js
│   │   │   └── hotelMockData.js
│   │   ├── pricing/
│   │   │   ├── pricingService.js
│   │   │   └── budgetCalculator.js
│   │   └── itinerary/
│   │       ├── itineraryService.js
│   │       └── exportService.js
│   ├── models/               # Data models and schemas
│   │   ├── Itinerary.js
│   │   ├── Flight.js
│   │   ├── Hotel.js
│   │   └── Activity.js
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── cors.js
│   ├── config/               # Configuration
│   │   ├── database.js
│   │   └── environment.js
│   ├── utils/                # Backend utilities
│   │   └── logger.js
│   └── app.js                # Express app setup
├── server.js                 # Server entry point (process.env.PORT)
├── package.json
└── app.yaml                  # Google Cloud App Engine config
```

### Structure Rationale

- **frontend/components/:** Organized by **UI concern** (common, search, selection, itinerary) for reusable presentational components
- **frontend/features/:** Organized by **business domain** (flights, hotels, activities) for vertical slices - each feature owns its data fetching, hooks, and business logic
- **frontend/state/:** Centralized state management with reducer pattern for itinerary construction state
- **backend/routes/:** Organized by **resource type** matching REST conventions
- **backend/services/:** Business logic separated from HTTP layer, enabling reuse and testing
- **Mock data co-located:** Mock data lives in service folders, easily replaceable with real API calls later

## Architectural Patterns

### Pattern 1: Reducer + Context for Itinerary State

**What:** Combine `useReducer` for complex state logic with Context API for deep component access. Separates state and dispatch into two contexts to optimize re-renders.

**When to use:** Multi-step forms where state involves multiple related entities (flights, hotels, activities) and many components need read/write access.

**Trade-offs:** 
- **Pro:** Avoids prop drilling, centralizes state logic, predictable state updates
- **Con:** All consumers re-render on state change (mitigate by splitting contexts)

**Example:**
```typescript
// itineraryReducer.js
export const initialState = {
  destination: null,
  dateRange: { start: null, end: null },
  flights: [],
  hotels: [],
  activities: [],
  totalCost: 0
};

export function itineraryReducer(state, action) {
  switch (action.type) {
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    
    case 'ADD_FLIGHT':
      return {
        ...state,
        flights: [...state.flights, action.payload],
        totalCost: state.totalCost + action.payload.price
      };
    
    case 'REMOVE_HOTEL':
      const hotel = state.hotels.find(h => h.id === action.payload);
      return {
        ...state,
        hotels: state.hotels.filter(h => h.id !== action.payload),
        totalCost: state.totalCost - (hotel?.price || 0)
      };
    
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// ItineraryContext.jsx
const ItineraryContext = createContext(null);
const ItineraryDispatchContext = createContext(null);

export function ItineraryProvider({ children }) {
  const [itinerary, dispatch] = useReducer(itineraryReducer, initialState);
  
  return (
    <ItineraryContext.Provider value={itinerary}>
      <ItineraryDispatchContext.Provider value={dispatch}>
        {children}
      </ItineraryDispatchContext.Provider>
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  return useContext(ItineraryContext);
}

export function useItineraryDispatch() {
  return useContext(ItineraryDispatchContext);
}
```

### Pattern 2: TanStack Query for Server State

**What:** Use TanStack Query (React Query) for fetching, caching, and synchronizing travel search results. Separates server state from application state.

**When to use:** Any data fetched from APIs (flight searches, hotel availability, activity listings). Especially valuable for data that can become stale and needs background refetching.

**Trade-offs:**
- **Pro:** Automatic caching, deduplication, background updates, loading/error states
- **Con:** Additional dependency, learning curve, might be overkill for pure mock data (but good to structure for future APIs)

**Example:**
```typescript
// queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});

// useFlightSearch.js
import { useQuery } from '@tanstack/react-query';
import { searchFlights } from '../api/flightsApi';

export function useFlightSearch(searchParams) {
  return useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => searchFlights(searchParams),
    enabled: !!searchParams.origin && !!searchParams.destination,
    staleTime: 2 * 60 * 1000, // Flights stale after 2 min
  });
}

// FlightWizard.jsx
function FlightWizard() {
  const [searchParams, setSearchParams] = useState({});
  const { data: flights, isLoading, error } = useFlightSearch(searchParams);
  
  // Component automatically re-fetches when searchParams change
}
```

### Pattern 3: Normalized State Shape for Travel Data

**What:** Structure itinerary state like a relational database - entities stored by ID with references between them. Prevents data duplication and simplifies updates.

**When to use:** When the same entity might appear in multiple places (e.g., selected flight shown in wizard step AND final itinerary review).

**Trade-offs:**
- **Pro:** Single source of truth, simple updates, no sync issues
- **Con:** More complex selectors, need helper functions to denormalize for display

**Example:**
```typescript
// Normalized shape
const state = {
  entities: {
    flights: {
      'flight1': { id: 'flight1', origin: 'NYC', destination: 'LAX', price: 350 },
      'flight2': { id: 'flight2', origin: 'LAX', destination: 'NYC', price: 320 }
    },
    hotels: {
      'hotel1': { id: 'hotel1', name: 'Beach Resort', pricePerNight: 150, nights: 3 }
    },
    activities: {
      'activity1': { id: 'activity1', name: 'City Tour', price: 75 }
    }
  },
  itinerary: {
    flightIds: ['flight1', 'flight2'],
    hotelIds: ['hotel1'],
    activityIds: ['activity1']
  }
};

// Selector to get full itinerary with denormalized data
export function selectFullItinerary(state) {
  return {
    flights: state.itinerary.flightIds.map(id => state.entities.flights[id]),
    hotels: state.itinerary.hotelIds.map(id => state.entities.hotels[id]),
    activities: state.itinerary.activityIds.map(id => state.entities.activities[id]),
    totalCost: calculateTotalCost(state)
  };
}
```

### Pattern 4: Component-Based Backend Services

**What:** Organize backend by business domain (flights, hotels, activities) rather than technical layer. Each domain is a semi-autonomous module with its own routes, service logic, and data access.

**When to use:** Always - especially as complexity grows. Makes it easy to replace mock data with real APIs later since each domain is isolated.

**Trade-offs:**
- **Pro:** Clear boundaries, easy to test, reduces coupling, enables team scaling
- **Con:** Slight duplication of patterns across services (mitigate with shared utilities)

**Example:**
```typescript
// Backend structure
services/
├── flights/
│   ├── flightService.js      // Business logic
│   ├── flightMockData.js     // Mock data (replaceable)
│   └── flightValidation.js   // Domain-specific validation
├── hotels/
│   ├── hotelService.js
│   ├── hotelMockData.js
│   └── hotelValidation.js
└── pricing/
    └── pricingService.js     // Cross-domain logic

// flightService.js
import { getMockFlights } from './flightMockData';
// import { getFlightsFromAPI } from './flightApiClient'; // Future

export async function searchFlights({ origin, destination, date }) {
  // Validation
  if (!origin || !destination) {
    throw new Error('Origin and destination required');
  }
  
  // Currently returns mock data
  const flights = getMockFlights();
  
  // Filter based on search params
  return flights.filter(f => 
    f.origin === origin && 
    f.destination === destination
  );
  
  // Future: Replace with real API
  // return getFlightsFromAPI({ origin, destination, date });
}

// routes/flights.js
import express from 'express';
import { searchFlights } from '../services/flights/flightService';

const router = express.Router();

router.get('/search', async (req, res, next) => {
  try {
    const flights = await searchFlights(req.query);
    res.json(flights);
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Pattern 5: Wizard Step State Machine

**What:** Model multi-step wizard as a state machine with explicit steps, transitions, and validation gates. Each step knows its validation requirements and next/previous steps.

**When to use:** Multi-step forms where steps have dependencies (can't select hotels until destination chosen) and need validation before proceeding.

**Trade-offs:**
- **Pro:** Explicit flow control, prevents invalid states, clear validation points
- **Con:** More upfront structure, can be rigid if flow changes frequently

**Example:**
```typescript
// wizardReducer.js
const STEPS = ['destination', 'dates', 'flights', 'hotels', 'activities', 'review'];

export const initialWizardState = {
  currentStep: 'destination',
  completedSteps: [],
  canProceed: false
};

export function wizardReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      const nextStep = STEPS[currentIndex + 1];
      
      return {
        ...state,
        currentStep: nextStep,
        completedSteps: [...state.completedSteps, state.currentStep]
      };
    }
    
    case 'PREVIOUS_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      const prevStep = STEPS[currentIndex - 1];
      
      return {
        ...state,
        currentStep: prevStep
      };
    }
    
    case 'VALIDATE_STEP': {
      // External validation result
      return {
        ...state,
        canProceed: action.payload.isValid
      };
    }
    
    default:
      return state;
  }
}

// WizardPage.jsx
function WizardPage() {
  const [wizardState, dispatch] = useReducer(wizardReducer, initialWizardState);
  const itinerary = useItinerary();
  
  // Validation logic
  useEffect(() => {
    const isValid = validateCurrentStep(wizardState.currentStep, itinerary);
    dispatch({ type: 'VALIDATE_STEP', payload: { isValid } });
  }, [wizardState.currentStep, itinerary]);
  
  const handleNext = () => {
    if (wizardState.canProceed) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };
  
  return (
    <div>
      <StepIndicator 
        steps={STEPS} 
        currentStep={wizardState.currentStep}
        completed={wizardState.completedSteps}
      />
      
      {wizardState.currentStep === 'destination' && <DestinationStep />}
      {wizardState.currentStep === 'dates' && <DatesStep />}
      {wizardState.currentStep === 'flights' && <FlightsStep />}
      
      <button onClick={handleNext} disabled={!wizardState.canProceed}>
        Next
      </button>
    </div>
  );
}

function validateCurrentStep(step, itinerary) {
  switch (step) {
    case 'destination':
      return !!itinerary.destination;
    case 'dates':
      return !!itinerary.dateRange.start && !!itinerary.dateRange.end;
    case 'flights':
      return itinerary.flights.length > 0;
    default:
      return true;
  }
}
```

## Data Flow

### Request Flow (Search and Selection)

```
User enters search criteria (origin, destination, dates)
    ↓
Search Component (FlightSearch.jsx)
    ↓
useFlightSearch hook (React Query)
    ↓
flightsApi.searchFlights() → GET /api/flights/search?origin=NYC&destination=LAX
    ↓
Express Route (routes/flights.js)
    ↓
Flight Service (services/flights/flightService.js)
    ↓
Mock Data (flightMockData.js) OR Real API (future)
    ↓
Response ← Service ← Route ← API Client
    ↓
TanStack Query Cache (automatic)
    ↓
Component renders results
    ↓
User selects flight
    ↓
Dispatch ADD_FLIGHT action
    ↓
Itinerary Reducer updates state
    ↓
All subscribed components re-render (ItinerarySummary, BudgetTracker, etc.)
```

### State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Component Tree                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  <ItineraryProvider>                              │  │
│  │    <QueryClientProvider>                          │  │
│  │      <WizardPage>                                 │  │
│  │        ├─ <FlightSearch> ──(useFlightSearch)──┐  │  │
│  │        │                                       │  │  │
│  │        ├─ <FlightCard>                        │  │  │
│  │        │    ├─ useItineraryDispatch()         │  │  │
│  │        │    └─ dispatch(ADD_FLIGHT)           │  │  │
│  │        │                                       │  │  │
│  │        └─ <ItinerarySummary>                  │  │  │
│  │             └─ useItinerary() (reads state)   │  │  │
│  │      </WizardPage>                            │  │  │
│  │    </QueryClientProvider>      │              │  │  │
│  │  </ItineraryProvider>          │              │  │  │
│  └─────────────────────────────────┼──────────────┘  │
│                                    │                   │
└────────────────────────────────────┼───────────────────┘
                                     ↓
                        ┌────────────────────────┐
                        │  TanStack Query Cache  │
                        │  (Server State)        │
                        │  - flights             │
                        │  - hotels              │
                        │  - activities          │
                        └────────────────────────┘
                                     
                                     ↓
                        ┌────────────────────────┐
                        │  Itinerary Context     │
                        │  (Application State)   │
                        │  - selected items      │
                        │  - total cost          │
                        │  - date range          │
                        └────────────────────────┘
```

### Key Data Flows

1. **Search Flow:** User input → React Query → API → Mock Data → Cache → Component display
2. **Selection Flow:** User clicks → Dispatch action → Reducer updates state → Context notifies subscribers → Components re-render
3. **Price Aggregation:** Selection made → Reducer calculates new total → BudgetTracker observes context → Displays updated budget
4. **Export Flow:** User clicks export → Export service reads itinerary context → Generates PDF/JSON server-side → Returns download link

## Google Cloud Deployment Architecture

### Deployment Pattern

```
┌──────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD                          │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Firebase Hosting                                   │ │
│  │  - Static React build (optimized bundle)           │ │
│  │  - CDN distribution                                 │ │
│  │  - Custom domain support                           │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
│                   ↓ (API requests /api/*)                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Cloud Run (Node.js Backend)                       │ │
│  │  - Containerized Express app                       │ │
│  │  - Auto-scaling (0 → N instances)                  │ │
│  │  - HTTPS endpoints                                 │ │
│  │  - Environment: process.env.PORT                   │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
│                   ↓ (data persistence)                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Firestore (NoSQL)                                 │ │
│  │  - Itineraries collection                          │ │
│  │  - User preferences                                │ │
│  │  - Real-time sync capabilities                     │ │
│  │  OR                                                │ │
│  │  Cloud SQL (PostgreSQL)                            │ │
│  │  - Structured data if needed                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Deployment Configuration

**Frontend (Firebase Hosting):**
```json
// firebase.json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "travel-backend",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Backend (Cloud Run):**
```yaml
# app.yaml (if using App Engine) or Dockerfile for Cloud Run
runtime: nodejs20

env_variables:
  NODE_ENV: 'production'

# server.js must listen to process.env.PORT
```

```javascript
// server.js
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Monolith is fine. Single Cloud Run instance, Firestore, Firebase Hosting. Mock data sufficient. |
| **1k-10k users** | Enable Cloud Run auto-scaling (up to 10 instances). Add Redis cache for frequently accessed data. Consider adding indexes to Firestore queries. Implement rate limiting. |
| **10k-100k users** | Split services if needed (read-heavy: separate search API from booking API). Use Cloud CDN for static assets. Implement database connection pooling. Add monitoring (Cloud Monitoring). Consider real API integrations with caching layer. |
| **100k+ users** | Consider microservices (separate flight service from hotel service). Introduce message queues (Pub/Sub) for async operations. Multi-region deployment. Advanced caching strategies. Real-time features via Firestore subscriptions. |

### Scaling Priorities

1. **First bottleneck: API response time** 
   - Implement TanStack Query caching on frontend (already planned)
   - Add Redis cache on backend for mock data responses
   - Use Cloud Run auto-scaling to handle traffic spikes

2. **Second bottleneck: Database queries**
   - Add Firestore composite indexes for complex queries
   - Implement pagination for search results
   - Denormalize data if read-heavy (store computed totals in itinerary documents)

3. **Third bottleneck: Real API rate limits (future)**
   - Implement backend caching layer for third-party API responses
   - Queue API requests with Pub/Sub to avoid rate limit bursts
   - Use webhooks instead of polling where available

## Anti-Patterns

### Anti-Pattern 1: Storing Server Data in Reducer

**What people do:** Fetch flight data and store it in the itinerary reducer alongside selected items.

**Why it's wrong:** Mixes server state (fetched data that can become stale) with application state (user selections). Makes cache invalidation hard and causes unnecessary re-fetches.

**Do this instead:** Use TanStack Query for server data (search results, available options) and Context/Reducer only for user selections and application state. Query handles caching, refetching, and staleness automatically.

```typescript
// ❌ Wrong: Everything in reducer
const reducer = (state, action) => {
  case 'FETCH_FLIGHTS_SUCCESS':
    return { ...state, availableFlights: action.payload }; // Don't store API data here
};

// ✅ Correct: Separate concerns
const { data: availableFlights } = useFlightSearch(params); // TanStack Query
const { selectedFlights } = useItinerary(); // Context/Reducer
```

### Anti-Pattern 2: Prop Drilling Through Wizard Steps

**What people do:** Pass itinerary state and update functions through 5+ levels of wizard step components.

**Why it's wrong:** Makes components tightly coupled, hard to refactor, and error-prone. Adding a new prop requires changing every intermediate component.

**Do this instead:** Use Context for itinerary state that's needed across the app. Props are fine for 2-3 levels, but beyond that, Context avoids drilling.

```typescript
// ❌ Wrong: Prop drilling
<WizardPage itinerary={itinerary} updateItinerary={update}>
  <StepContainer itinerary={itinerary} updateItinerary={update}>
    <FlightStep itinerary={itinerary} updateItinerary={update}>
      <FlightCard itinerary={itinerary} updateItinerary={update} />
    </FlightStep>
  </StepContainer>
</WizardPage>

// ✅ Correct: Context
<ItineraryProvider>
  <WizardPage>
    <StepContainer>
      <FlightStep>
        <FlightCard /> {/* Uses useItinerary() and useItineraryDispatch() */}
      </FlightStep>
    </StepContainer>
  </WizardPage>
</ItineraryProvider>
```

### Anti-Pattern 3: Nested State Objects Without Normalization

**What people do:** Store deeply nested itinerary structure that duplicates data.

**Why it's wrong:** When a flight appears in multiple places (search results AND itinerary), updating price requires finding and changing all copies. Leads to sync bugs.

**Do this instead:** Normalize state - store entities by ID and reference by ID. Use selectors to denormalize for display.

```typescript
// ❌ Wrong: Nested duplication
{
  searchResults: {
    flights: [{ id: 'f1', price: 350, origin: 'NYC' }]
  },
  itinerary: {
    outboundFlight: { id: 'f1', price: 350, origin: 'NYC' }, // Duplicate!
    returnFlight: { id: 'f2', price: 320, origin: 'LAX' }
  }
}

// ✅ Correct: Normalized
{
  entities: {
    flights: {
      'f1': { id: 'f1', price: 350, origin: 'NYC' },
      'f2': { id: 'f2', price: 320, origin: 'LAX' }
    }
  },
  itinerary: {
    outboundFlightId: 'f1',
    returnFlightId: 'f2'
  }
}
```

### Anti-Pattern 4: Building All Phases Before Mock Data Works

**What people do:** Try to implement flights, hotels, cars, activities, export, and API integration all at once.

**Why it's wrong:** Creates massive complexity, makes debugging hard, delays feedback. Violates incremental development principle.

**Do this instead:** Build one vertical slice completely (e.g., flights end-to-end with mock data) before adding next slice. Prove the architecture works before expanding.

**Build order:**
1. Basic itinerary state + one component type (flights)
2. Wizard flow with flights only
3. Add second component (hotels)
4. Add pricing aggregation
5. Add remaining components
6. Add export
7. Replace mock data with real APIs (one at a time)

### Anti-Pattern 5: Not Listening to process.env.PORT on Backend

**What people do:** Hardcode server port or use custom environment variable.

**Why it's wrong:** Google Cloud (App Engine, Cloud Run) assigns the port dynamically via `process.env.PORT`. Hardcoded port causes deployment failure.

**Do this instead:** Always use `process.env.PORT` with a fallback for local development.

```typescript
// ❌ Wrong
app.listen(3000); // Fails on Google Cloud

// ✅ Correct
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

## Integration Points

### External Services (Future)

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Flight APIs** (Amadeus, Skyscanner) | REST API with rate limiting, backend caching | Replace mock data in flightService.js, maintain same interface |
| **Hotel APIs** (Booking.com, Expedia) | REST API with webhook support | May need webhook handlers for price updates |
| **Maps API** (Google Maps) | Client-side SDK for location search | Autocomplete for destination selection |
| **Payment** (Stripe) | Server-side integration for checkout (future phase) | Not in initial version, but design for it |
| **PDF Generation** (Puppeteer, PDFKit) | Server-side rendering | For export functionality |
| **Email** (SendGrid, Mailgun) | REST API for itinerary sharing | For export via email |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ Backend** | REST API over HTTPS | JSON payloads, standard HTTP status codes |
| **React Components ↔ State** | Context hooks (useItinerary, useItineraryDispatch) | Unidirectional data flow |
| **Components ↔ Server Data** | TanStack Query hooks | Automatic caching, background refetching |
| **Backend Services ↔ Database** | Direct Firestore SDK or SQL queries | Services own their data access patterns |
| **Frontend ↔ Cloud Storage** (for export files) | Signed URLs from backend | Backend generates temporary download links |

## Build Order Implications

### Phase 1: Foundation
**Goal:** Prove the architecture works with minimal features
- Set up React app with routing (React Router)
- Set up Node.js/Express backend with one route
- Deploy to Google Cloud (Firebase Hosting + Cloud Run)
- Implement itinerary Context + Reducer (empty state)
- Single component type: Flights with mock data
- Basic search and selection flow

**Why first:** Validates deployment pipeline, state management pattern, and API communication before adding complexity.

### Phase 2: Core Wizard Flow
**Goal:** Complete multi-step selection experience
- Implement wizard state machine
- Add Hotels component type with mock data
- Step validation and navigation
- Basic price aggregation

**Why second:** Extends proven patterns from Phase 1, adds complexity gradually.

### Phase 3: Itinerary Management
**Goal:** Display and modify selections
- Itinerary review page
- Budget tracker with running total
- Remove/modify selected items
- Add Activities and Cars component types

**Why third:** Requires stable selection flow from Phase 2. Completes the core value proposition.

### Phase 4: Export and Polish
**Goal:** Make itineraries shareable
- PDF export
- JSON export
- Print-friendly view
- Email sharing (stretch)

**Why fourth:** All domain data types exist. Export is read-only operation on stable data.

### Phase 5: API Integration (Future)
**Goal:** Replace mock data with real APIs
- Start with one provider (e.g., Amadeus for flights)
- Add caching layer (Redis)
- Implement rate limiting
- Gradually replace remaining mock data

**Why last:** Architecture is proven, interfaces are stable. Changing data source doesn't require changing component APIs.

## Sources

- **HIGH confidence**: React official documentation on state management (https://react.dev/learn/managing-state, https://react.dev/learn/choosing-the-state-structure, https://react.dev/reference/react/useReducer)
- **HIGH confidence**: Redux normalization patterns for complex relational data (https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
- **MEDIUM confidence**: TanStack Query documentation for server state management (https://tanstack.com/query/latest)
- **MEDIUM confidence**: Express.js project structure conventions (https://expressjs.com/en/starter/generator.html)
- **MEDIUM confidence**: Node.js architectural best practices - component-based structure (https://github.com/goldbergyoni/nodebestpractices)
- **MEDIUM confidence**: Firebase Hosting and Cloud Run deployment patterns (https://firebase.google.com/docs/hosting, https://docs.cloud.google.com/run/docs, https://docs.cloud.google.com/appengine/docs/standard/nodejs/building-app/writing-web-service)
- **MEDIUM confidence**: Firestore data modeling for document-based storage (https://firebase.google.com/docs/firestore)
- **LOW confidence**: Travel booking system patterns from GitHub repositories (https://github.com/topics/travel-booking) - common MERN stack pattern observed
- **LOW confidence**: Micro-frontends article for component organization principles (https://martinfowler.com/articles/micro-frontends.html) - adapted for component boundaries

---
*Architecture research for: Travel Planning and Itinerary Builder*
*Researched: 2026-05-08*
