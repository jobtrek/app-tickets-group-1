import { createFileRoute } from "@tanstack/react-router";
import TicketCreation from "../../src/pages/TicketCreation.tsx";

export const Route = createFileRoute("/_authenticated/create-ticket")({
	component: () => <TicketCreation />,
});
