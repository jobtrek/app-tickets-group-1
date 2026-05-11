import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert } from "../src/components/ErrorMessage";
import { Spinner } from "../src/components/Loading";
import { Navbar } from "../src/pages/Navbar";
import { useErrorStore } from "../src/store/errorStore";
import { useUserStore } from "../src/store/userStore";
import { useTicketListUpdates } from "../src/utils/useTicketListUpdates";

export const Route = createRootRoute({
	errorComponent: ({ error }) => (
		<div className="flex h-screen items-center justify-center bg-gray-50">
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
				<div className="p-3 bg-red-50 rounded-full">
					<AlertCircle className="text-red-500" size={28} />
				</div>
				<div className="text-center">
					<h2 className="text-base font-semibold text-gray-900 mb-1">
						Une erreur est survenue
					</h2>
					<p className="text-sm text-gray-500">{(error as Error).message}</p>
				</div>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
				>
					<RefreshCw size={14} />
					Réessayer
				</button>
			</div>
		</div>
	),
	pendingComponent: () => (
		<div className="flex h-screen items-center justify-center bg-gray-50">
			<div className="flex flex-col items-center gap-4">
				<Spinner size="lg" />
				<p className="text-sm text-gray-400">Chargement…</p>
			</div>
		</div>
	),
	component: () => {
		const username = useUserStore((state) => state.username);
		const error = useErrorStore((state) => state.error);
		const _clearError = useErrorStore((state) => state.clearError);

		useTicketListUpdates();

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
