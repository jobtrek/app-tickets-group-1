import { ticketRoutes } from "./routes/tickets.route";

const _server = Bun.serve({
	port: 3001,
	routes: ticketRoutes,
});
