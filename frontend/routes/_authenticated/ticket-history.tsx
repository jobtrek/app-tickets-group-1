import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/ticket-history")({
	component: () => <h1>Dashboard</h1>,
});
