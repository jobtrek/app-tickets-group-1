import tailwind from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	root: "./frontend",
	envDir: "..",
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./routes",
			generatedRouteTree: "./routeTree.gen.ts",
		}),
		react(),
		tailwind(),
	],
});
