# Travel Planning and Experience Engine

## What This Is

An AI-powered travel planning application that instantly generates complete multi-day trip itineraries. Users input their destination, dates, budget, and preferences, then AI (Claude API) creates a full itinerary including flights, hotels, daily activities, and restaurant recommendations with realistic pricing and budget tracking.

## Core Value

Users can instantly generate complete, personalized multi-day trip itineraries powered by AI, with clear pricing for every component and automatic budget tracking.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can input trip requirements (destination, dates, budget, travelers, preferences)
- [ ] AI generates complete multi-day itinerary with one click
- [ ] Itinerary includes flights (outbound + return) with prices
- [ ] Itinerary includes hotels for each night with prices
- [ ] Itinerary includes daily activities (morning/afternoon/evening) with prices
- [ ] Itinerary includes restaurant recommendations with estimated costs
- [ ] User can see complete day-by-day timeline view
- [ ] User can see total cost breakdown by category
- [ ] Budget tracker shows remaining budget (visual indicator)
- [ ] Application is responsive on mobile devices
- [ ] Application is deployed to Google Cloud
- [ ] User can generate new itinerary with different inputs

### Out of Scope

- Real travel API integrations (Amadeus, Skyscanner) — AI generates realistic mock data
- User authentication/accounts — single-session generation for v1
- Actual booking — display only, no payment processing
- Itinerary editing — AI generates, user accepts (editing in v2)
- Multiple itinerary options — single AI-generated result for v1
- Save/load trips — no database persistence for v1
- Mobile native apps — responsive web app only
- Multi-destination trips — single destination for v1

## Context

This is a 2-hour hackathon project demonstrating AI-powered travel planning. The focus is on building an impressive demo that showcases:
- AI integration (Claude API) for content generation
- Complete multi-day itinerary generation
- Beautiful Material-UI interface with timeline/card displays
- Budget tracking and cost breakdown
- Responsive design
- Google Cloud deployment

AI approach is faster to build and more impressive than manual step-by-step flows, making it ideal for hackathon timeline.

## Constraints

- **Timeline**: 2 hours total — hackathon sprint
- **Tech Stack**: React + Vite + TypeScript + Material-UI (frontend), Claude API (AI), Google Cloud (deployment)
- **AI**: Claude API for itinerary generation — realistic but mock pricing
- **Scope**: Working demo with AI generation — not production-ready with accounts/persistence
- **Public Project**: No proprietary or company-specific integrations (e.g., no Expedia-specific code)
- **Deployment**: Must deploy to your personal Google Cloud account

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| AI-powered generation vs manual builder | AI creates complete itineraries faster, more impressive for 2-hour timeline, shows full vision immediately | — Pending |
| Claude API direct from frontend | No backend needed for hackathon, simplifies deployment, direct API calls | — Pending |
| Material-UI for all components | Pre-built professional components save time, responsive by default, timeline/card layouts perfect for itineraries | — Pending |
| Single-destination trips for v1 | Reduces complexity in itinerary building and AI prompt engineering | — Pending |
| Google Cloud Run deployment | Containerized deployment, auto-scaling, simple setup for React apps | — Pending |

---
*Last updated: 2026-05-08 after initialization*