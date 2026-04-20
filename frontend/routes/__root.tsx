import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Alert } from "../src/components/ErrorMessage";
import { Navbar } from "../src/pages/Navbar";
import { useErrorStore } from "../src/store/errorStore";
import { useUserStore } from "../src/store/userStore";

export const Route = createRootRoute({
	component: () => {
		const username = useUserStore((state) => state.username);
		const error = useErrorStore((state) => state.error);
		const clearError = useErrorStore((state) => state.clearError);

		return (
			<div className="flex h-screen">
				{error && <Alert variant="error" message={error} />}
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
