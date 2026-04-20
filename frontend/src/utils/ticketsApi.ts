import { apiClient } from "./clientApi";

const API_URL = import.meta.env.VITE_API_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

export const createTicketFromForm = async (
	ticket: FormData,
	idUser: number,
) => {
	const payload = {
		title: ticket.get("title"),
		description: ticket.get("description"),
		image: ticket.get("img") || null,
		level: ticket.get("urgence"),
		idUser: idUser,
	};
	const postResponse = await apiClient.post(API_URL, payload);
	const getResponse = await apiClient.get(API_URL);

	const createdTicket = postResponse.data.createdTicket;
	const allTickets = getResponse.data;

	return { createdTicket, allTickets };
};
export const userLogout = async () => {
	await apiClient.post(LOGOUT_URL);
};
