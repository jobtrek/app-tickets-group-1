import { rootRoute } from "./__root.tsx";
import { createRoute } from "@tanstack/react-router";
import TicketCreation from "../src/pages/TicketCreation.tsx"

export const ticketCreationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: () => <TicketCreation />
});
