import tailwind from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	root: "./frontend",
	envDir: "..",
	server: {
		host: "0.0.0.0",
		proxy: {
			"/api": {
				target: "http://backend:3001",
				changeOrigin: true,
				ws: true,
			},
			"/uploads": {
				target: "http://backend:3001",
				changeOrigin: true,
			},
		},
	},
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
