import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ticket-history/tsx")({
	component: () => <h1>Dashboard</h1>,
});
