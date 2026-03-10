import axios from "axios";

import { USER_URL } from "../../../src/config/api";

export interface RegisterData {
	username: string;
	email: string;
	password: string;
	role: string;
}

export const registerUserApi = async (user: RegisterData) => {
	const postData = await axios.post(USER_URL, user);
	return postData;
};
