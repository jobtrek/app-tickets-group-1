import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../src/pages/Navbar";

export const Route = createRootRoute({
	component: () => (
		<div className="flex h-screen">
			<nav>
				<Navbar />
			</nav>
			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	),
});
