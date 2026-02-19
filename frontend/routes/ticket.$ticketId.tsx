import { rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";
import TicketCreation from "../src/pages/TicketCreation.tsx"

export const ticketInformationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket",
  component: () => < TicketCreation />
});
