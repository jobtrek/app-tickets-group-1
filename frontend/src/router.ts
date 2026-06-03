import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import type { SessionUser } from "./utils/checkSession";

export type RouterContext = {
	user: SessionUser | null;
};

export const router = createRouter({
	routeTree,
	context: { user: null } satisfies RouterContext,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
