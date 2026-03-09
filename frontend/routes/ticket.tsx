import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ticket")({
	component: () => <div>test</div>,
});
