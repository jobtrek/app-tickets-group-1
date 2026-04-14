import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "../src/store/userStore";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const username = useUserStore.getState().username;
		throw redirect({ to: username ? "/dashboard" : "/login" });
	},
});
