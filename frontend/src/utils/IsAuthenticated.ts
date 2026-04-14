import { useUserStore } from "../store/userStore";

// this is for the protected routes in the future, do not remove.
export const isAuthenticated = (): boolean => {
	const { idUser, username } = useUserStore.getState();
	return idUser !== 0 && username !== "";
};
isAuthenticated