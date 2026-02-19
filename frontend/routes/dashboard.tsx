import { rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <h1>Dashboard</h1>,
});
