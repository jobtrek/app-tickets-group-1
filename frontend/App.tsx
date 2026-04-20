import { RouterProvider } from "@tanstack/react-router";
import { AlertErrorBoundary } from "./src/components/ErrorMessage";
import { router } from "./src/router";

export function App() {
	return (
		<AlertErrorBoundary fallbackMessage="Une erreur inattendue est survenue. Veuillez rafraîchir la page.">
			<RouterProvider router={router} />
		</AlertErrorBoundary>
	);
}
