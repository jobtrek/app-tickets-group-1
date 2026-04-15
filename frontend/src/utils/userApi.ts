import axios from "axios";
import type { LoginData, RegisterData } from "./types";

const USER_URL = import.meta.env.VITE_USER_URL;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

export const registerUserApi = async (user: RegisterData) => {
	const postData = await axios.post(USER_URL, user);
	console.log(postData);
	return postData;
};

export const loginUserApi = async (user: LoginData) => {
	const confirmCredentials = await axios.post(LOGIN_URL, user, {
		withCredentials: true,
	});
	return confirmCredentials;
};

export const logoutUser = async () => {
	await axios.post(LOGOUT_URL);
};
