import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../src/pages/Navbar";
import { useUserStore } from "../src/store/userStore";

export const Route = createRootRoute({
	component: () => {
		const username = useUserStore((state) => state.username);

		return (
			<div className="flex h-screen">
				{username && (
					<nav>
						<Navbar />
					</nav>
				)}
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		);
	},
});
