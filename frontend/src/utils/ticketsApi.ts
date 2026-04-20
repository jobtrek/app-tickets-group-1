import { apiClient } from "./clientApi";

const API_URL = import.meta.env.VITE_API_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

export const createTicketFromForm = async (
	ticket: FormData,
	idUser: number,
) => {
	ticket.append("idUser", idUser.toString());
	const postResponse = await apiClient.post(API_URL, ticket);
	const getResponse = await apiClient.get(API_URL);
	const createdTicket = postResponse.data.createdTicket;
	const allTickets = getResponse.data;
	return { createdTicket, allTickets };
};
export const userLogout = async () => {
	await apiClient.post(LOGOUT_URL);
};

export const createComment = async (
	commentText: string,
	idUser: number,
	idTicket: number,
) => {
	const { data } = await apiClient.post(`${API_URL}/${idTicket}/comment`, {
		commentText,
		idUser,
		idTicket,
	});
	return data;
};
export const getComments = async (idTicket: number) => {
	const { data } = await apiClient.get(`${API_URL}/${idTicket}/comment`);
	return data;
};
