# Live Search — Implementation Plan

## Overview
Client-side live search scoped to a specific resource (e.g. ticket titles) on the dashboard.
Data lives in Zustand, filtering happens in local component state, no DB round-trips.

---

## 1. Zustand Store
- Store the raw resource list (e.g. `tickets: Ticket[]`) in your existing store
- Expose a single action `setTickets(tickets: Ticket[])` to populate it
- No search query, no filtered list — those are UI concerns

```ts
interface DashboardStore {
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
}
```

---

## 2. Data Fetching
- Fetch once when the dashboard mounts (e.g. in a `useEffect` or TanStack Router `loader`)
- Call `setTickets()` with the result
- Mark loading state locally if needed

---

## 3. Search Component
- Local `useState<string>` for the query
- Read `tickets` from the Zustand store
- Derive filtered list inline — no memoization needed unless the list is large

```ts
const [query, setQuery] = useState('')
const tickets = useDashboardStore(s => s.tickets)

const filtered = tickets.filter(t =>
  t.title.toLowerCase().includes(query.toLowerCase())
)
```

---

## 4. UI
- Controlled `<input>` bound to `query`
- Render `filtered` instead of `tickets` in your list/table
- Optionally show a "no results" empty state

---

## 5. What to skip
- No debounce — client-side filtering is fast enough
- No Zustand state for the query — it's ephemeral UI state
- No fuzzy matching — substring is sufficient and predictable