import { rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";

export const ticketHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tickethistory",
  component: () => <h1>Dashboard</h1>,
});
