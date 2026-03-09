import { RouterProvider } from "@tanstack/react-router";
import { router } from "./src/router";

export function App() {
	return <RouterProvider router={router} />;
}
