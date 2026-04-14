import axios from "axios";
import { LOGIN_URL, USER_URL } from "../../../src/config/api";
import type { LoginData, RegisterData } from "./types";

export const registerUserApi = async (user: RegisterData) => {
	const postData = await axios.post(USER_URL, user);
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
