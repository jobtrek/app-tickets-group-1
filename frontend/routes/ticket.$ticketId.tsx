import { rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";

export const ticketInformationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket/$ticketId",
  component: () => {
    const { ticketId } = ticketInformationRoute.useParams();
    return <h1>Ticket: {ticketId}</h1>;
  },
});
