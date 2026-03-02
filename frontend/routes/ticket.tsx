import { rootRoute } from "./__root.tsx";
import { createRoute } from "@tanstack/react-router";

export const ticketViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket",
  component: () => <div>test</div>
});
