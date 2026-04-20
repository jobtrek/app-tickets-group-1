import axios from "axios";
import { router } from "../router";
import { useUserStore } from "../store/userStore";

const MAX_RETRIES = 1;
export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});
// Intercepteur de réponse
apiClient.interceptors.response.use(
	// SI TOUT VA BIEN : On laisse passer la réponse normalement
	(response) => response,

	// SI CA FOIRE : Axios nous donne un objet "error"
	async (error) => {
		// "originalRequest", c'est juste la sauvegarde de ce que tu voulais faire au début
		const originalRequest = error.config;
		const status = error.response?.status;

		// Le cookie est mort ou tu n'as pas le droit d'être là (401/403)
		if (status === 401 || status === 403) {
			useUserStore.getState().clearUser(); // On vide les infos de l'utilisateur
			router.navigate({ to: "/login" }); // On le vire vers la page Login
			return Promise.reject(error); // On arrête tout
		}

		// --- LA DEUXIÈME CHANCE (RETRY) ---
		// Si on n'a pas encore réessayé, on retente la requête UNE fois.
		if (
			!originalRequest._retry &&
			(originalRequest._retryCount || 0) < MAX_RETRIES
		) {
			originalRequest._retry = true; // On marque qu'on est en train de réessayer
			originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
			return apiClient(originalRequest); // On relance la même requête
		}

		// --- LE TRI DES ERREURS ---

		// Cas A : Le serveur ne répond même pas (Internet coupé)
		if (!error.response) {
			return Promise.reject({ message: "Vérifiez votre connexion internet." });
		}

		// Cas B : Le serveur est cassé (Erreur 500)
		if (status >= 500) {
			return Promise.reject({ message: "Le serveur est en panne." });
		}

		// Si c'est une autre erreur (ex: 404), on la renvoie telle quelle
		return Promise.reject(error);
	},
);
