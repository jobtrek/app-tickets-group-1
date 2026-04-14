Auth Flow Summary
  Login

  1. Frontend sends POST /api/login with { email, password }.
  2. Backend validates the body with valibot, then looks up the user by email in SQLite.
  3. Bun.password.verify() checks the submitted password against the stored hash.
  4. If valid, a random UUID session token is generated and stored in the cookies table alongside the user_id.
  5. The token is sent back to the browser as an httpOnly, secure, sameSite: strict cookie named session (valid 24h).
  6. The response also returns { username, email, id } which the frontend stores in Zustand + localStorage via persist.

  Subsequent Requests

  - The browser automatically attaches the session cookie to every request (because withCredentials: true is set in axios).
  - The backend auth middleware is supposed to read that cookie, look up the token in the cookies table, and confirm it's valid — this part is not yet implemented.

  Session Storage (DB side)

  - Sessions live in a cookies table with session_token and user_id.
  - There is currently no delete query, so sessions accumulate and never expire server-side (only the cookie's maxAge of 24h limits them client-side).

  Frontend State

  - After login, useUserStore (persisted to localStorage) holds { id_user, username, email }.
  - On page refresh, Zustand rehydrates from localStorage so the user appears logged in without hitting the server again.
  - There is no /me endpoint to validate whether the session cookie is still actually alive on the server.