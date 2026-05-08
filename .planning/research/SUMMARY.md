# Research Summary: Travel Planning and Experience Engine

**Research completed:** 2026-05-08
**Project type:** Hackathon project (simplified scope)

## Executive Summary

A travel itinerary builder enabling users to construct trips by selecting flights, hotels, cars, and activities with price comparison. **Hackathon-focused:** Working demo with mock data, Material-UI for rapid responsive UI development, simplified architecture.

**Recommended stack:**
- **Frontend:** React 19 + Vite + TypeScript + Material-UI (MUI v6) for responsive components
- **Backend:** Node.js + Express 5 + in-memory mock data (no database for hackathon)
- **State:** React Context + useReducer (simple, no external state libraries)
- **Deployment:** Vercel/Netlify (frontend) + simple Node.js backend

**Hackathon simplifications:**
- No database (in-memory mock data)
- No authentication (single session)
- No real APIs (mock data only)
- Material-UI components (pre-built, responsive, fast to implement)
- Focus on core demo flow only

## Key Stack Decisions

### Frontend Core
- **React 19** with **Vite** — Modern, fast build tool
- **Material-UI v6** — Pre-built responsive components, theme system, mobile-first
- **TypeScript** — Type safety for travel data structures
- **React Router v7** — Multi-step navigation

**Why Material-UI for hackathon:**
- Pre-built components (Button, Card, TextField, Stepper, Grid)
- Built-in responsive system (Grid, useMediaQuery)
- Professional look out-of-box
- Fast theme customization
- Mobile-first by default

### Backend Core
- **Node.js 24 LTS** + **Express 5**
- **In-memory mock data** (no database setup time)
- Simple REST API structure

### Table Stakes Features (Must Have)

**For hackathon demo:**
1. Multi-component search (flight, hotel, car, activity inputs)
2. Price comparison (show 3-5 options per component)
3. Date-based filtering (hotel dates match flight dates)
4. Visual itinerary display (Material-UI Cards + Timeline)
5. Budget tracking (sum of selected items)
6. Basic export (print-friendly view)

**Defer to post-hackathon:**
- PDF export
- Save/load trips (no persistence)
- Real-time price updates (just show UI)
- Map visualization
- User accounts
- Real API integration

## Architecture (Simplified for Hackathon)

### Component Structure
```
┌─────────────────────────────────────┐
│   React App (Material-UI Theme)    │
├─────────────────────────────────────┤
│  TripBuilder (Stepper component)    │
│    ├─ Step 1: Destination & Dates   │
│    ├─ Step 2: Flight Selection      │
│    ├─ Step 3: Hotel Selection       │
│    ├─ Step 4: Car Selection         │
│    ├─ Step 5: Activity Selection    │
│    └─ Step 6: Review & Summary      │
├─────────────────────────────────────┤
│  State: Context + useReducer        │
│  (selectedFlight, selectedHotel...) │
└─────────────────────────────────────┘
```

### Backend Structure
```
/api
  /flights      → returns mock flight data
  /hotels       → returns mock hotel data (filtered by dates)
  /cars         → returns mock car rental data
  /activities   → returns mock activity data
```

**Mock data in-memory** (no database needed for hackathon)

### State Management
- **useReducer** for trip state (selections, budget)
- **Context** to pass state through steps
- Simple actions: SELECT_FLIGHT, SELECT_HOTEL, etc.

## Critical Pitfalls (Hackathon Edition)

### Top 3 to Address

1. **Date handling without timezone complexity**
   - Use simple date strings (YYYY-MM-DD) for hackathon
   - Assume single timezone, no time-of-day validation
   - Prevention: Keep date format consistent everywhere

2. **State management without over-engineering**
   - Don't use Redux/Zustand/TanStack Query for hackathon
   - Context + useReducer is sufficient for demo
   - Prevention: Keep state flat and simple

3. **Price display without currency complexity**
   - Use single currency (USD) for demo
   - Simple number formatting ($1,234)
   - Prevention: All mock data in same currency

### Things to Skip for Hackathon
- Complex timezone handling (use simple dates)
- Currency conversion (single currency)
- Price staleness tracking (static mock data)
- Database schema design (no database)
- Authentication/authorization (open demo)

## Suggested Phases (3 phases for hackathon)

**Phase 1: Foundation & UI Setup** (2-3 hours)
- Vite + React + TypeScript + Material-UI setup
- Stepper navigation with MUI Stepper component
- Basic layout with MUI Grid and theme
- Mock data structure defined

**Phase 2: Core Flow** (4-5 hours)
- Step 1: Trip inputs (destination, dates) with MUI TextField/DatePicker
- Step 2-5: Component selection (flights, hotels, cars, activities) with MUI Cards
- Price comparison display with MUI Table/Grid
- State management (Context + useReducer)
- Backend API endpoints with mock data

**Phase 3: Polish & Demo** (2-3 hours)
- Step 6: Review page with MUI Timeline/Summary
- Budget tracking with MUI Chip/Badge
- Print-friendly export view
- Mobile responsive testing
- Deployment (Vercel for frontend, simple Node backend)

**Total: 8-11 hours** (realistic for hackathon)

## Material-UI Components to Use

**Navigation:**
- `Stepper` + `Step` + `StepLabel` — Multi-step wizard

**Layout:**
- `Container` + `Grid` — Responsive layout
- `Card` + `CardContent` — Option display
- `AppBar` + `Toolbar` — Header

**Inputs:**
- `TextField` — Text inputs
- `DatePicker` (from @mui/x-date-pickers) — Date selection
- `Select` + `MenuItem` — Dropdowns
- `Button` — Actions

**Display:**
- `Typography` — Text styling
- `Chip` — Price tags, badges
- `Timeline` — Itinerary display
- `Table` — Price comparison

**Feedback:**
- `Alert` — Validation messages
- `CircularProgress` — Loading states

## Ready for Requirements Definition

Research complete with hackathon-appropriate scope. Stack simplified, Material-UI selected for responsive UI, 3-phase structure fits typical hackathon timeline.

**Key simplifications applied:**
- In-memory data (no database)
- Material-UI (pre-built components)
- Single currency, simple dates
- Context + useReducer (no complex state libraries)
- 8-11 hour timeline

---
*Research completed: 2026-05-08*
*Scope: Hackathon project*
