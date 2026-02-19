import { rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div></div>
});
