import { createFileRoute } from "@tanstack/react-router";
import { checkSession } from "../src/utils/checkSession";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => checkSession(),
});
