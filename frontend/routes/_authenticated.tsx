import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../src/utils/IsAuthenticated";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		if (!isAuthenticated()) {
			throw redirect({ to: "/login" });
		}
	},
});
