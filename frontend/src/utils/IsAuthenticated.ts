import { useUserStore } from "../store/userStore";

export const isAuthenticated = (): boolean => {
	const { id_user, username } = useUserStore.getState();
	return id_user !== 0 && username !== "";
};
