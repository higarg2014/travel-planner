# Travel Planning and Experience Engine

## What This Is

A web application that helps travelers plan complete trips by building itineraries incrementally. Users input their destination, dates, budget, and preferences, then step through selecting flights, accommodation, car rentals, and activities. The system shows options at different price points and creates a cohesive trip plan that can be saved, modified, and exported.

## Core Value

Users can build a complete, personalized trip itinerary by making informed choices at each step, with clear price comparisons to stay within budget.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can input trip requirements (destination, dates, budget, party size, preferences)
- [ ] User can select flight options with price comparison
- [ ] User can select accommodation options filtered by travel dates
- [ ] User can select car rental options based on travel duration
- [ ] User can select activities and experiences for their destination
- [ ] User can see their complete itinerary with all selections
- [ ] User can modify any part of their plan (swap flight, hotel, activities)
- [ ] User can see total cost across all selections
- [ ] User can save/export their itinerary
- [ ] System shows price comparison for options (budget, mid-range, premium)
- [ ] System displays mock real-time update indicators (price changes, availability)
- [ ] User can track price changes on selected options (visual mock)

### Out of Scope

- Real external API integrations — v1 uses mock data only
- User authentication/accounts — single-session planning for v1
- Actual booking — display only, no payment processing
- Mobile native apps — web-first approach
- Multi-destination trips — single destination for v1
- Collaborative planning — single user for v1

## Context

This is a public portfolio project demonstrating full-stack development with React and Node.js. The focus is on building a clean, functional demo that showcases:
- Dynamic UI that adapts based on user selections
- Incremental workflow where each choice influences subsequent options
- Price comparison and budget tracking
- Mock integration patterns that could connect to real APIs later

Initial version uses mock data to prove the concept and user experience without dependency on external travel APIs.

## Constraints

- **Tech Stack**: React (frontend), Node.js (backend), Google Cloud (deployment) — required
- **Data Sources**: Mock data only for v1 — no external API dependencies
- **Scope**: Working demo flow — not production-ready with accounts/persistence
- **Public Project**: No proprietary or company-specific integrations (e.g., no Expedia-specific code)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Incremental builder flow | Users pick flight → hotel → car → activities in sequence, each step filtered by previous choices | — Pending |
| Mock data with realistic structure | Build full integration patterns but use local mock data to avoid API costs and dependencies | — Pending |
| Visual-only real-time updates | Show update UI elements without actual polling/refresh logic to demonstrate concept | — Pending |
| Single-destination trips for v1 | Reduces complexity in itinerary building and data management | — Pending |

---
*Last updated: 2026-05-08 after initialization*