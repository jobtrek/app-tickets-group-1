import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "../src/store/userStore";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const { username, role } = useUserStore.getState();
		if (!username) throw redirect({ to: "/login" });
		throw redirect({ to: role === "admin" ? "/dashboard" : "/create-ticket" });
	},
});
