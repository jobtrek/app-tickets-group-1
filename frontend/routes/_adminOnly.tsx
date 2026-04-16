import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "../src/store/userStore";
import { isAuthenticated } from "../src/utils/IsAuthenticated";

export const Route = createFileRoute("/_adminOnly")({
	beforeLoad: () => {
		if (!isAuthenticated()) {
			throw redirect({ to: "/login" });
		}
		const role = useUserStore.getState().role;
		if (role !== "admin") {
			throw redirect({ to: "/create-ticket" });
		}
	},
});
