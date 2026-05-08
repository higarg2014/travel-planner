# Pitfalls Research

**Domain:** Travel Planning and Itinerary Builder
**Researched:** 2026-05-08
**Confidence:** MEDIUM (based on domain knowledge and established patterns; specific sources limited by search availability)

## Critical Pitfalls

### Pitfall 1: Naive Date/Time Handling Without Timezone Context

**What goes wrong:**
Dates and times stored without timezone information lead to incorrect itinerary displays. A flight departing LAX at 10:00 PM PST shown as 10:00 PM EST to a New York user creates confusion. Users miss flights, book wrong hotel dates, or see nonsensical itineraries (hotel checkout before flight landing).

**Why it happens:**
JavaScript Date objects default to local timezone. Developers store timestamps without associated timezone data, or convert everything to UTC and lose the "local experience" context. The database stores `2026-06-15T14:00:00Z` but the user needs to know "2:00 PM Tokyo time" not "2:00 AM their current location."

**How to avoid:**
- Store datetimes with explicit timezone identifiers (IANA format: "America/Los_Angeles", "Asia/Tokyo")
- Use libraries like `date-fns-tz` or `luxon` that preserve timezone context
- Store three values: UTC timestamp, display timezone, display format
- Example: `{ utc: "2026-06-15T14:00:00Z", tz: "Asia/Tokyo", display: "2026-06-15T23:00:00+09:00" }`
- Never use local Date for cross-timezone calculations

**Warning signs:**
- Itinerary times change when user switches devices/locations
- Flight departure and arrival times don't respect actual timezone differences
- Hotel dates don't align with flight dates when filtered
- Unit tests pass but manual testing with different system timezones fails

**Phase to address:**
Phase 1 (Core Data Models) — establish timezone-aware data structures from the start. Refactoring later requires touching every date field across the entire application.

---

### Pitfall 2: Incremental State Management Without Transaction Boundaries

**What goes wrong:**
User adds flight, then hotel, then car. Flight gets updated, hotel dates should update, but don't. Or flight price changes mid-booking, budget calculation now incorrect, but user doesn't see it. Partial states exist where flight selected but not "committed" leading to "ghost" bookings in UI.

**Why it happens:**
React state updates are async and can interleave. Multiple components update different parts of trip state without coordination. No clear "transaction" model for multi-step selections. State scattered across useState hooks without central validation.

**How to avoid:**
- Use reducer pattern for trip state with atomic updates
- Implement "draft" vs "committed" state model
- Validate entire trip state on each step transition
- Use state machine (XState or similar) to enforce valid state transitions
- Example flow: `SELECTING_FLIGHT → FLIGHT_SELECTED → SELECTING_HOTEL → VALIDATING → COMMITTED`
- Prevent partial saves: buffer changes, validate full state, commit atomically

**Warning signs:**
- Users report "items disappearing" from itinerary
- Budget totals don't match sum of individual items
- Filtering breaks when multiple items selected
- Race conditions in console logs during rapid clicking
- Impossible states appear in bug reports (hotel before flight selected)

**Phase to address:**
Phase 1 (Builder Core) — state management architecture must be solid before adding features. Changing from useState to reducer after features exist is high-risk refactoring.

---

### Pitfall 3: Price Aggregation Without Currency Normalization

**What goes wrong:**
User selects $500 USD flight, €300 EUR hotel, £100 GBP car. Budget displays "$900" by naively summing numbers. Real cost is ~$1,240 USD. Budget tracking becomes meaningless, user exceeds budget without realizing.

**Why it happens:**
Mock data or early implementations skip currency conversion. Different providers return prices in different currencies. Floating point arithmetic creates rounding errors. Exchange rates change between selection and booking.

**How to avoid:**
- Normalize all prices to single base currency immediately on receipt
- Store both original and normalized prices: `{ amount: 300, currency: "EUR", normalized: { amount: 330, currency: "USD", rate: 1.10, timestamp: "..." } }`
- Use integer cents/pips to avoid floating point errors (store 50000 cents not $500.00)
- Display original currency to user, calculate budgets in normalized currency
- Add currency conversion timestamp and rate for debugging
- For mock data: still implement full currency structure to avoid refactoring

**Warning signs:**
- Budget math doesn't add up
- Price comparisons fail when mixing providers
- Rounding errors accumulate in budget calculations
- Different users see different totals for same items
- Currency symbols appear inconsistently

**Phase to address:**
Phase 1 (Data Models) — price structure must support currencies from day one. Changing from `price: number` to `price: {amount, currency}` touches every price display and calculation.

---

### Pitfall 4: Filter Logic Without Dependency Validation

**What goes wrong:**
User selects flight arriving June 15, 2026. Hotel filters show options from June 1-30. User books hotel June 10-12. Flight and hotel dates don't overlap. Or: flight departs LAX, hotels shown in NYC. Logical inconsistencies slip through.

**Why it happens:**
Filters operate independently without cross-checking dependencies. Flight selection doesn't constrain hotel date range. Hotel location doesn't verify proximity to flight destination. Each component manages its own filter state without coordination.

**How to avoid:**
- Implement dependency graph for trip components
- Flight selection auto-sets hotel date range: `arrivalDate to arrivalDate + maxTripLength`
- Hotel location filter auto-scopes to flight destination ± radius
- Validate dependencies on each selection: `validateHotelAgainstFlight(hotel, flight)`
- Show dependent constraints in UI: "Hotels shown for Las Vegas (based on your flight)"
- Disable invalid options rather than filtering them out (better UX feedback)

**Warning signs:**
- Users report "picking items that don't make sense together"
- QA finds impossible itineraries (hotel in wrong city)
- Filters return too many results (no dependency scoping)
- Users manually entering dates that should auto-populate
- Support tickets about "dates not matching"

**Phase to address:**
Phase 2 (Flight/Hotel Integration) — dependency logic must exist when connecting first two booking types. Adding later requires rewriting filter components.

---

### Pitfall 5: Optimistic UI Updates Without Rollback Strategy

**What goes wrong:**
User adds hotel to trip. UI immediately shows it added. Backend validation fails (dates invalid, sold out, price changed). Item still shows in UI. User proceeds thinking hotel is booked. At checkout: error. Trust broken.

**Why it happens:**
Optimistic updates improve perceived performance. Developers add optimistic update but forget failure case. Rollback logic not implemented or doesn't restore previous state correctly. Error handling only shows toast, doesn't revert UI.

**How to avoid:**
- Store previous state before optimistic update
- Implement explicit rollback function: `rollbackTo(previousState)`
- Show loading states for critical operations (don't be too optimistic)
- Use middleware pattern for state updates: `beforeUpdate → optimisticUpdate → validate → commit or rollback`
- For trip builder: maybe don't use optimistic updates at all (selections aren't slow enough to need it)
- Clear error messaging with action: "Hotel could not be added. [Retry] [Pick Different Hotel]"

**Warning signs:**
- Items appear in trip then disappear after page refresh
- Backend logs show failed operations but UI shows success
- Users report "items I added are missing"
- Race conditions between optimistic update and validation response
- Stale data in UI after errors

**Phase to address:**
Phase 1-2 (Any Phase with API Integration) — establish pattern early. Every optimistic update needs rollback from day one.

---

### Pitfall 6: Date Range Overlaps and Boundary Conditions

**What goes wrong:**
Flight arrives 11:30 PM June 15. Hotel check-in is 3:00 PM June 15. User can't check in because they arrive after midnight. Or: flight departs 6:00 AM June 20, hotel checkout 11:00 AM June 20. User needs to check out before flight.

**Why it happens:**
Date comparisons ignore time-of-day. Logic checks "same day" but not "compatible times." Boundary conditions (midnight crossovers, early morning flights) not tested. Timezone differences compound the issue.

**How to avoid:**
- Validate time-of-day compatibility, not just dates
- Add time buffers: hotel check-in must be ≥ 4 hours after flight arrival
- Warn users about tight connections: "Your flight arrives at 11PM, most hotels stop check-in at midnight"
- Handle midnight boundaries explicitly: flight at 12:30 AM is "previous day" for hotel purposes
- Test boundary conditions: midnight flights, early AM departures, late PM arrivals

**Warning signs:**
- User reports "booking hotel for wrong dates"
- Itinerary looks valid but timing is impossible
- Edge case bugs around midnight
- Conflicting times with same dates
- Users manually adjusting hotel dates after flight selection

**Phase to address:**
Phase 2 (Date Filtering Logic) — implement when connecting flights and hotels. Critical for MVP credibility.

---

### Pitfall 7: Stale Price Data in Comparison Views

**What goes wrong:**
User searches flights at 10:00 AM, sees $500 flight. Compares hotels for 20 minutes. Returns to flights at 10:25 AM, price now $650 but UI still shows $500. User books, surprised by actual price. Or worse: budget calculations based on stale prices.

**Why it happens:**
Mock data is static. No expiration timestamps on cached prices. State management doesn't track "data age." Real APIs have price volatility but mock implementation doesn't simulate it.

**How to avoid:**
- Add timestamp to all price data: `{ price: 500, currency: "USD", fetchedAt: "2026-05-08T10:00:00Z" }`
- Display data age: "Price as of 10:00 AM" or "Price updated 25 minutes ago"
- Implement TTL (time-to-live) for price caches: expire after 15 minutes
- Show staleness warnings: "Prices may have changed. [Refresh]"
- Even with mock data: simulate price changes to test staleness handling
- Lock prices on selection: "Price guaranteed for 10 minutes after adding to trip"

**Warning signs:**
- No timestamps visible in UI
- Prices never change during session
- Mock data returns identical results every time
- No "refresh prices" functionality
- Budget calculations drift from displayed prices

**Phase to address:**
Phase 1-2 (Price Display) — build staleness handling into mock data system. Easier to add from start than retrofit.

---

### Pitfall 8: Budget Tracking Without Item Removal Handling

**What goes wrong:**
User adds $500 flight, $300 hotel. Budget shows $800 used. User removes flight, adds different $600 flight. Budget shows $1,400 ($800 + $600) instead of $900. Removal didn't decrement budget.

**Why it happens:**
Budget tracking only listens to "add" events, not "remove" or "replace." State updates don't recalculate budget from scratch. Reducer doesn't handle DELETE action. Derived state (budget) not truly derived—cached incorrectly.

**How to avoid:**
- Calculate budget from current state, don't track deltas: `budget = items.reduce((sum, item) => sum + item.normalizedPrice, 0)`
- Make budget a derived value, not stored state
- If caching needed: recalculate on any state change, not just additions
- Test removal and replacement flows explicitly
- Use selectors/memoization for performance: `const budget = useMemo(() => calculateBudget(items), [items])`

**Warning signs:**
- Budget increases but never decreases
- Removing items doesn't update budget
- Budget calculations inconsistent after modifications
- "Recalculate Budget" button exists (shouldn't be needed)
- Budget in state object instead of computed value

**Phase to address:**
Phase 1 (State Management) — derived state pattern must be established early. Stored budget values create sync issues.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store prices as plain numbers without currency | Faster initial implementation, simpler mock data | Cannot support multi-currency, budget tracking broken, refactoring touches every price field | Never—structure is cheap to add upfront |
| Use browser Date objects without timezone library | No dependencies, standard JS | Timezone bugs proliferate, cross-timezone calculations broken, requires full rewrite | Never in travel apps—timezones are core domain |
| Put all trip state in single useState | Simple to start, no reducer boilerplate | Becomes unmaintainable at ~5 fields, no transaction boundaries, race conditions | Only for proof-of-concept, must refactor before Phase 2 |
| Skip validation between trip components | Faster feature shipping, independent components | Users create invalid itineraries, support burden increases, requires redesign | Never—validation is core value prop |
| Hard-code date ranges in filters (e.g., "next 30 days") | Works for demo, no date math | Fails for long-term planning, arbitrary limits frustrate users | Only in MVP if clearly marked as limitation |
| Mock APIs return synchronously | Simpler code, no loading states | Doesn't test race conditions, optimistic updates untested, API integration reveals timing bugs | Only if you add artificial delays to simulate async |

## Integration Gotchas

Common mistakes when connecting to external services (or preparing for them).

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Flight APIs | Assuming all airports have IATA codes | Some airports use ICAO only; store both, search by city as fallback |
| Hotel APIs | Storing hotel location as single lat/lng | Locations have multiple coordinates (entrance, center, main building); store as polygon or point-of-interest type |
| Car Rental APIs | Assuming pickup/dropoff at same location | One-way rentals exist; store pickup and dropoff separately with "same location" flag |
| Currency APIs | Calling for every price conversion | Batch conversions, cache rates for session, include rate timestamp for debugging |
| Availability APIs | Treating availability as boolean | Availability has states: available, limited (3 left), waitlist, sold out; affects UI urgency |
| Price APIs | Assuming price includes all fees | Separate base price, taxes, fees; show breakdown in UI to match user expectations |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all search results into state at once | Memory grows unbounded, UI sluggish with large result sets | Implement pagination or virtual scrolling; load 20-50 at a time | 500+ results per search |
| Re-calculating budget on every render | Unnecessary CPU usage, React DevTools shows excessive render time | Memoize budget calculation with useMemo, only recalc when items change | 10+ items in trip |
| Storing full itinerary in localStorage | QuotaExceededError when trip has many items with large metadata | Store only essential fields (IDs, selections), fetch details from API/cache | ~50 items with images/descriptions |
| N+1 API calls for related data | Search 20 hotels → 20 API calls for hotel details | Batch requests, use API endpoints that return related data in single call | 20+ items needing detail fetches |
| Deep equality checks on complex itinerary state | UI freezes during state updates | Use shallow equality, normalize state (IDs instead of nested objects), structural sharing | State object >100 fields deep |
| Client-side filtering of large datasets | Lag on every filter change | Filter server-side or use Web Workers for client-side, debounce filter inputs | 1000+ items to filter |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing API keys in frontend code | Scrapers harvest keys, abuse rate limits, cost overruns | Proxy all external APIs through backend, rotate keys regularly |
| Storing payment info in browser state | XSS can steal card data, PCI compliance violated | Never handle payment data in frontend; use tokenization (Stripe, etc.) |
| Trusting client-side price calculations | Users modify prices in DevTools, book at wrong price | Recalculate all prices server-side before checkout, never trust client totals |
| Leaking user itineraries in URL parameters | Shared URLs expose personal travel plans, privacy violation | Use session-based or short-lived tokens, not full itinerary data in URLs |
| Insufficient rate limiting on search | Abuse leads to bill shock from API providers | Implement backend rate limiting, cache common searches, throttle per-user |
| Allowing arbitrary date ranges | DoS via requesting 100-year date ranges | Validate date ranges (e.g., max 1 year), limit result set sizes, timeout long queries |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing 500+ hotels without sorting/filtering defaults | Overwhelming, users give up, paradox of choice | Default to "Recommended" sort (rating + price), show 20 at a time, prominent filters |
| Not persisting trip state across sessions | Users lose work, must restart, frustration | Auto-save to localStorage every change, show "Last saved" timestamp, offer explicit save |
| Unclear what happens when modifying booked items | Fear of breaking existing bookings, users avoid modifications | Clear "Draft changes" mode with explicit "Apply Changes" action, show before/after comparison |
| Mixing search results with trip items in UI | Confusion about what's selected vs. available | Clear visual separation: "Your Trip" sidebar + "Search Results" main area |
| No indication of why item can't be added | User sees disabled button, no explanation | Tooltip or inline message: "Hotel dates must overlap with flight arrival/departure" |
| Budget overage shown only at checkout | User builds expensive trip, frustrated at end | Real-time budget indicator, show "Over budget by $200" immediately, color-code warnings |
| Dates shown in inconsistent formats | User unsure if "1/5/26" is Jan 5 or May 1 | Use unambiguous format: "Jan 5, 2026" or ISO 8601, respect user locale settings |
| No mobile-friendly date pickers | Typing dates on mobile is painful | Use native date pickers, offer quick select ("Next Weekend", "Week in June") |
| Itinerary not printable | Users want physical copy for travel | Provide print-friendly view, hide filters/search UI, include QR codes for digital access |
| No offline support | Users lose access during flight or abroad | Cache selected trip in service worker, show read-only view offline, sync when back online |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Date Handling:** Often missing timezone association — verify every date field has timezone identifier, not just UTC timestamp
- [ ] **Price Comparison:** Often missing currency normalization — verify all prices converted to base currency before comparison/summing
- [ ] **Filter Dependencies:** Often missing cross-component validation — verify hotel dates auto-constrain to flight dates, location filters linked
- [ ] **State Management:** Often missing rollback on errors — verify optimistic updates have rollback handlers, error states tested
- [ ] **Budget Tracking:** Often missing removal/update handling — verify budget recalculates on add/remove/modify, not just adds
- [ ] **Timezone Display:** Often missing local time display — verify itinerary shows times in destination timezone, not user's current timezone
- [ ] **Data Staleness:** Often missing timestamps — verify price data has fetchedAt timestamp, staleness warnings displayed
- [ ] **Edge Cases:** Often missing boundary condition tests — verify midnight flights, same-day departures, timezone crossovers handled
- [ ] **Accessibility:** Often missing keyboard navigation — verify full trip builder navigable without mouse, screen reader friendly
- [ ] **Loading States:** Often missing granular indicators — verify each async operation has loading state, not just global spinner

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Naive date handling discovered in QA | HIGH | Add timezone library (luxon/date-fns-tz), refactor all date fields to include timezone, update storage schema, migrate existing data |
| State management insufficient | HIGH | Migrate from useState to useReducer or state machine, define state transitions, add validation layer, test all flows |
| Currency handling missing | MEDIUM | Add currency field to all price data, implement normalization layer, update UI to show original currency, add currency conversion service |
| Filter dependencies missing | MEDIUM | Build dependency graph, add validation functions, update filter logic to respect dependencies, add UI feedback for constraints |
| Budget tracking broken | LOW | Convert budget to derived state, add selector with memoization, remove stored budget values, test add/remove/modify flows |
| Optimistic updates without rollback | MEDIUM | Add previous state tracking, implement rollback functions, update error handlers to revert state, add user feedback for failures |
| Timezone display issues | MEDIUM | Add timezone display logic, format times with destination timezone, add "local time" indicators in UI, test across timezones |
| Stale price data | LOW | Add timestamp to price data, implement TTL logic, add refresh UI, show staleness warnings, cache with expiration |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Naive date/time handling | Phase 1: Core Models | Create trip spanning timezones, verify times display correctly in destination TZ |
| Incremental state management | Phase 1: Builder Core | Add/remove/modify items rapidly, verify no race conditions or partial states |
| Price aggregation without currency | Phase 1: Data Models | Mix items with different currencies, verify budget normalizes correctly |
| Filter logic without dependencies | Phase 2: Flight/Hotel Integration | Select flight, verify hotel dates auto-constrain, try invalid combinations |
| Optimistic UI without rollback | Phase 2-3: Any API Integration | Simulate API failures, verify UI reverts correctly, no stale success states |
| Date range overlaps | Phase 2: Date Logic | Book midnight flight, verify hotel dates compatible, test early AM departures |
| Stale price data | Phase 2: Price Display | Wait >15 min after search, verify staleness indicator shows, prices refresh |
| Budget tracking without removal | Phase 1: State Management | Add item, remove item, verify budget decrements, replace item, verify correct total |

## Sources

This research is based on:
- Common patterns in travel application development (domain knowledge)
- React state management best practices
- Timezone handling challenges in booking systems
- Price comparison and currency normalization patterns
- UX research in travel planning interfaces

**Confidence Level:** MEDIUM

Rationale: Based on established domain patterns and technical knowledge of React/Node.js travel applications. Specific external sources limited by search tool availability, but pitfalls represent well-documented issues in travel tech. Would benefit from:
- Post-mortems from major travel platforms (Expedia, Booking.com tech blogs)
- Timezone handling library documentation (Luxon, date-fns-tz)
- React state management case studies for complex multi-step builders
- Currency handling best practices from payment processors

These pitfalls are specific to the travel planning domain and the stated technical concerns (incremental builder, price aggregation, timezone handling, filtering logic, budget tracking, data consistency).

---

*Pitfalls research for: Travel Planning and Experience Engine*
*Researched: 2026-05-08*
