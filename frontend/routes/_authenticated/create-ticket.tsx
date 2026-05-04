import { createFileRoute, redirect } from "@tanstack/react-router";
import TicketCreation from "../../src/pages/TicketCreation.tsx";
import { useUserStore } from "../../src/store/userStore";

export const Route = createFileRoute("/_authenticated/create-ticket")({
	beforeLoad: () => {
		const role = useUserStore.getState().role;
		if (role === "admin") {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: () => <TicketCreation />,
});
