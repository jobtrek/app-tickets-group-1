# WebSocket Logic Flow - Real-Time Comments

## Overview

The application uses **Bun's native WebSocket support** combined with a **pub/sub pattern** to deliver real-time comment updates to all users viewing the same ticket. No external WebSocket library is needed -- both the backend (Bun) and frontend (browser `WebSocket` API) use built-in support.

---

## Architecture Diagram

```
 User A (Browser)                Backend (Bun)                  User B (Browser)
 ─────────────────          ──────────────────────────          ─────────────────
       |                             |                               |
       |── WS connect ──────────────>|                                |
       |   ws://localhost:3001/      |                                |
       |   api/tickets/5/ws          |                                |
       |                             |── subscribe("ticket-5") ──>    |
       |                             |                                |── WS connect ──>
       |                             |── subscribe("ticket-5") ──>    |
       |                             |                                |
       |── POST /api/tickets/        |                                |
       |   5/comment ──────────────> |                                |
       |                             |── insert into DB               |
       |                             |── publish("ticket-5", data)    |
       |                             |                                |
       |<── WS message (comment) ──|── WS message (comment) ──────>|
       |                             |                                |
```

---

## Step-by-Step Flow

### 1. WebSocket Connection (Client -> Server)

When a user opens a ticket detail page, the React component `TicketView` mounts and establishes a WebSocket connection.

**Frontend** (`frontend/src/pages/TicketView.tsx`, lines 44-51):

```ts
const ws = new WebSocket(
  `ws://localhost:3001/api/tickets/${ticketIdNumber}/ws`
);
ws.onmessage = (event) => {
  const comment = JSON.parse(event.data);
  setComments((prev) => [...prev, comment]);
};
return () => ws.close();
```

- Connects to `ws://localhost:3001/api/tickets/{ticketId}/ws`
- Registers a message handler that parses incoming JSON and appends it to the comment list
- Cleans up the connection when the component unmounts

### 2. HTTP -> WebSocket Upgrade (Server)

The GET request on the `/ws` route triggers the upgrade handler.

**Route** (`backend/src/routes/commentRoute.ts`, lines 11-13):

```ts
"/api/tickets/:id/ws": {
  GET: websocketUpgrade,
}
```

**Controller** (`backend/src/controllers/commentController.ts`, lines 69-73):

```ts
export const websocketUpgrade = (req: Request) => {
  const id =req.params.id;
  const success = getServer()?.upgrade(req, { data: { ticketId: id } });
  if (!success) return new Response("WS upgrade failed", { status: 400 });
};
```

- Extracts the ticket ID from the URL
- Upgrades the HTTP connection to WebSocket via `server.upgrade()`
- Attaches `{ ticketId: id }` as connection data so the server knows which ticket this socket belongs to

### 3. Channel Subscription (Server)

Once the upgrade succeeds, Bun fires the `open` handler.

**Server config** (`backend/src/index.ts`, lines 15-24):

```ts
websocket: {
  open(ws) {
    ws.subscribe(`ticket-${ws.data.ticketId}`);
  },
  close(ws) {
    ws.unsubscribe(`ticket-${ws.data.ticketId}`);
  },
  message(ws, msg) {}
}
```

- **open**: Subscribes the socket to channel `ticket-{ticketId}` (e.g. `ticket-5`)
- **close**: Unsubscribes from the channel on disconnect
- **message**: Empty -- clients don't send messages through the socket, they use HTTP POST instead

### 4. Comment Submission (Client -> Server via HTTP)

When a user submits a comment, it goes through a standard HTTP POST, not through the WebSocket.

**Frontend** (`frontend/src/pages/TicketView.tsx`, lines 54-58):

```ts
const handleSubmit = async () => {
  if (!commentInput.trim()) return;
  setCommentInput("");
  await createComment(commentInput, userId, ticketIdNumber);
};
```

This calls `createComment()` which sends a POST request to `/api/tickets/{id}/comment`.

### 5. Database Insert + WebSocket Publish (Server)

**Controller** (`backend/src/controllers/commentController.ts`, lines 9-42):

```ts
// 1. Validate incoming data
const validated = v.parse(CommentPostSchema, body);

// 2. Insert into database
const [inserted] = await db.insert(comments).values({...}).returning();

// 3. Query full comment with author details
const [fullComment] = await db
  .select({
    idComment, commentText, createdAt, authorId, authorName, authorRole
  })
  .from(comments)
  .innerJoin(users, eq(comments.idUser, users.idUser))
  .where(eq(comments.idComment, inserted.idComment));

// 4. Publish to all subscribers on this ticket's channel
publish(`ticket-${inserted?.idTicket}`, JSON.stringify(fullComment));
```

The `publish` function broadcasts the comment data to every WebSocket subscribed to that ticket's channel.

### 6. Publisher Utility (Server)

**Utility** (`backend/src/utils/publisher.ts`):

```ts
let _server: Server | null = null;

export const setServer = (s: Server) => { _server = s; };
export const publish = (channel: string, data: string) => {
  _server?.publish(channel, data);
};
export const getServer = () => _server;
```

- Stores a reference to the Bun server instance (set once at startup in `index.ts`)
- `publish()` delegates to Bun's built-in `server.publish()` which sends data to all sockets subscribed to the given channel

### 7. Real-Time Update (Server -> All Clients)

All connected clients subscribed to `ticket-{ticketId}` receive the message through their `ws.onmessage` handler (see step 1). The comment is parsed and appended to the React state, making it appear instantly in the UI.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **HTTP POST for sending comments** | Comments need validation and database persistence -- HTTP gives us proper request/response semantics and error handling |
| **WebSocket only for receiving updates** | The `message` handler is empty; the socket is a one-way broadcast channel from server to clients |
| **Bun native pub/sub** | No need for Redis or external message brokers -- Bun handles channel subscription and message fanout internally |
| **Channel per ticket** | Channel name `ticket-{id}` ensures users only receive comments for the ticket they're viewing |

---

## Data Flow Summary

```
POST /api/tickets/:id/comment
        |
        v
  [Validate with Valibot]
        |
        v
  [Insert into PostgreSQL via Drizzle]
        |
        v
  [Query full comment with JOIN on users table]
        |
        v
  [publish("ticket-{id}", JSON comment)]
        |
        v
  [Bun broadcasts to all subscribed WebSockets]
        |
        v
  [Each client's onmessage handler updates React state]
```
