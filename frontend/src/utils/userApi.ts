import { apiClient } from "./clientApi";
import type { LoginData, RegisterData, UpdateUserData } from "./types";

const USER_URL = import.meta.env.VITE_USER_URL;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
const UPDATE_USER_URL = import.meta.env.VITE_UPDATE_USER;

export const registerUserApi = async (user: RegisterData) => {
	const postData = await apiClient.post(USER_URL, user);
	return postData;
};

export const loginUserApi = async (user: LoginData) => {
	const confirmCredentials = await apiClient.post(LOGIN_URL, user, {
		withCredentials: true,
	});
	return confirmCredentials;
};

export const logoutUser = async () => {
	await apiClient.post(LOGOUT_URL, {}, { withCredentials: true });
};

export const updateUser = async (
	userId: number,
	data: Omit<UpdateUserData, "userid">,
) => {
	const response = await apiClient.patch(`${UPDATE_USER_URL}${userId}`, data);
	return response.data[0];
};
