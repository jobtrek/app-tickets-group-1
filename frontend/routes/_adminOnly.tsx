import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkSession } from "../src/utils/checkSession";

export const Route = createFileRoute("/_adminOnly")({
	beforeLoad: async () => {
		const user = await checkSession();
		if (user.role !== "admin") {
			throw redirect({ to: "/create-ticket" });
		}
	},
});
