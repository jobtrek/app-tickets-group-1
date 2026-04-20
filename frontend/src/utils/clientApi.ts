import axios from "axios";
import { router } from "../router";
import { useUserStore } from "../store/userStore";

const MAX_RETRIES = 1;
export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});
apiClient.interceptors.response.use(
	(response) => response,

	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;

		if (status === 401 || status === 403) {
			useUserStore.getState().clearUser();
			router.navigate({ to: "/login" });
			return Promise.reject(error);
		}

		if (
			!originalRequest._retry &&
			(originalRequest._retryCount || 0) < MAX_RETRIES
		) {
			originalRequest._retry = true;
			originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
			return apiClient(originalRequest);
		}

		if (!error.response) {
			return Promise.reject(new Error("Vérifiez votre connexion internet."));
		}

		if (status >= 500) {
			return Promise.reject(new Error("Le serveur est en panne."));
		}

		return Promise.reject(error);
	},
);
