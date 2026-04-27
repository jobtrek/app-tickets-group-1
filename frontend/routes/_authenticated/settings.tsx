import { createFileRoute } from "@tanstack/react-router";
import UserSettings from "../../src/pages/UserSettings.tsx";

export const Route = createFileRoute("/_authenticated/settings")({
	component: () => <UserSettings />,
});
