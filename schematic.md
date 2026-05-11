# Filtering Architecture — Schematic

**Pages:** Dashboard (admin) · TicketHistory (user)  
**Stack:** Zustand v5 · TanStack Router v1 loaders · React 19

---

## Data Entry Point

```
Route loader (dashboard.tsx / ticket-history.tsx)
  └─ apiClient.get(VITE_API_URL)
       └─ GET /api/tickets
            └─ Ticket[]
                 └─ useEffect: setTickets(loaderTickets)
                      └─ useTicketStore.tickets[]
```

Tickets live in Zustand. The loader fires on every navigation (`staleTime: 0`,
`shouldReload: true`). The raw list is not persisted to localStorage — only the
filter preferences are (via `partialize`).

---

## Zustand Store — `useTicketStore`

```
useTicketStore (persisted: sort, statusFilter, urgencyFilter)
│
├─ tickets:          Ticket[]          ← raw list, NOT persisted
├─ sort:             string            ← "desc" | "asc" | "az"  (persisted)
├─ statusFilter:     string[]          ← active status checkboxes (persisted)
├─ urgencyFilter:    string[]          ← active urgency checkboxes (persisted)
│
├─ setTickets(tickets)                 ← called by loader useEffect
├─ addTicket(ticket)                   ← called by WebSocket ticket_created
├─ updateTicketInList(id, updates)     ← called by WebSocket ticket_*_update
├─ setSort(sort)                       ← called by <Select> onChange
├─ toggleStatusFilter(status)          ← called by status checkbox onChange
└─ toggleUrgencyFilter(urgency)        ← called by urgency checkbox onChange
```

`sort`, `statusFilter`, and `urgencyFilter` are **shared** between Dashboard and
TicketHistory. A filter set on one page is still active when navigating to the other.

---

## Dashboard — Call Graph

```
Dashboard component
│
├─ READ from store (6 narrow selectors)
│   ├─ useTicketStore(s => s.sort)
│   ├─ useTicketStore(s => s.setSort)
│   ├─ useTicketStore(s => s.statusFilter)
│   ├─ useTicketStore(s => s.toggleStatusFilter)
│   ├─ useTicketStore(s => s.urgencyFilter)
│   └─ useTicketStore(s => s.toggleUrgencyFilter)
│
├─ DERIVED LIST
│   useTicketStore(useShallow(getFilteredTickets))
│        │
│        └─ getFilteredTickets(state: TicketStore): Ticket[]
│                │
│                ├─ 1. COPY     [...state.tickets]
│                │
│                ├─ 2. FILTER   if statusFilter.length > 0
│                │              keep t where statusFilter.includes(t.statusName)
│                │
│                ├─ 3. FILTER   if urgencyFilter.length > 0
│                │              keep t where urgencyFilter.includes(
│                │                t.adminLevel ?? t.level   ← admin override wins
│                │              )
│                │
│                └─ 4. SORT     "asc"  → a.createdAt.localeCompare(b.createdAt)
│                               "desc" → b.createdAt.localeCompare(a.createdAt)
│                               "az"   → a.title.localeCompare(b.title)
│
└─ RENDER
    filteredTickets.map(row => <tr>)
    status cell: statusByTicketId[row.idTicket] ?? row.statusName
    urgency cell: row.adminLevel ?? row.level
```

---

## TicketHistory — Call Graph

```
TicketHistory component
│
├─ READ from store (4 narrow selectors)
│   ├─ useTicketStore(s => s.sort)
│   ├─ useTicketStore(s => s.setSort)
│   ├─ useTicketStore(s => s.statusFilter)
│   └─ useTicketStore(s => s.toggleStatusFilter)
│   (no urgencyFilter selector — urgency UI is absent from this page)
│
├─ READ user identity
│   └─ useUserStore(s => s.idUser)  → userId: number
│
├─ DERIVED LIST
│   useTicketStore(useShallow(getFilteredUserTickets(userId)))
│        │
│        └─ getFilteredUserTickets(userId)(state: TicketStore): Ticket[]
│                │
│                ├─ 1. COPY     [...state.tickets]
│                │
│                ├─ 2. SCOPE    keep t where t.idUser === userId
│                │              (user sees only their own tickets)
│                │
│                ├─ 3. FILTER   if statusFilter.length > 0
│                │              keep t where statusFilter.includes(t.statusName)
│                │
│                ├─ 4. FILTER   if urgencyFilter.length > 0
│                │              keep t where urgencyFilter.includes(t.level)
│                │              ⚠ uses t.level only — ignores t.adminLevel
│                │                (differs from Dashboard which uses adminLevel ?? level)
│                │
│                └─ 5. SORT     identical to Dashboard
│
└─ RENDER
    filteredTickets.length === 0 → empty state + "Créer un ticket" button
    filteredTickets.map(row => <tr>)
    status cell: statusByTicketId[row.idTicket] ?? row.statusName
```

---

## Side-by-Side Comparison

```
                        Dashboard               TicketHistory
─────────────────────── ─────────────────────── ───────────────────────
Source tickets          state.tickets (all)     state.tickets (all)
User scoping            none (admin sees all)   t.idUser === userId
Status filter           ✓ statusFilter          ✓ statusFilter
Urgency filter          ✓ urgencyFilter         ✓ urgencyFilter (read)
Urgency field used      adminLevel ?? level     level only  ⚠
Sort                    sort (shared)           sort (shared)
Urgency UI shown        ✓ checkboxes            ✗ (hidden)
Empty state             none                    "no tickets" message
```

---

## Re-render Triggers

`useShallow` wraps both selector calls. Zustand re-runs the selector on every
store write; `useShallow` does a shallow-equal on the returned array and skips
the React re-render if the result is identical.

```
Store write             Selector re-runs?   Component re-renders?
─────────────────────── ─────────────────── ─────────────────────
setTickets(new list)    yes                 yes (array changed)
addTicket(ticket)       yes                 yes
updateTicketInList(…)   yes                 yes
toggleStatusFilter(…)   yes                 yes
toggleUrgencyFilter(…)  yes                 yes
setSort(…)              yes                 yes
setUser(…)              no (different store)  only TicketHistory
                                              (userId changes scope)
```

---

## Persistent State (localStorage)

```
key: "ticket-store"
  ├─ sort          shared, survives refresh
  ├─ statusFilter  shared, survives refresh
  └─ urgencyFilter shared, survives refresh

key: "user-storage"
  └─ idUser        used by TicketHistory to scope tickets
```

`tickets[]` is intentionally excluded from persistence (`partialize`).
On every page load the loader re-fetches from the API and calls `setTickets`.

---

## Where to Add Live Search

The search query stays in local `useState` inside each page component.
It runs as a final pass **after** the Zustand selector returns:

```
useTicketStore(useShallow(getFilteredTickets))
  └─ Ticket[]  (already filtered by status, urgency, sort)
       └─ .filter(t =>
            t.title.toLowerCase().includes(query.toLowerCase())
          )
               └─ rendered in <table>
```

The search input binds to local state only — no store changes needed:

```
const [query, setQuery] = useState("")

<input value={query} onChange={e => setQuery(e.target.value)} />
```

This means search resets on navigation (correct) and does not persist
across refreshes (correct), while status/sort/urgency preferences still do.
