import axios from "axios";
import { LOGIN_URL, USER_URL } from "../../../src/config/api";

export interface RegisterData {
	username: string;
	email: string;
	password: string;
	role: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export const registerUserApi = async (user: RegisterData) => {
	const postData = await axios.post(USER_URL, user);
	return postData;
};

export const loginUserApi = async (user: LoginData) => {
	const confirmCredentials = await axios.post(LOGIN_URL, user, {
		withCredentials: false,
	});
	return confirmCredentials;
};
