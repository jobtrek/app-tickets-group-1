import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_adminOnly")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
		if (context.user.role !== "admin") throw redirect({ to: "/create-ticket" });
	},
});
