import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

export const createTicketFromForm = async (
	ticket: FormData,
	idUser: number,
) => {
	ticket.append("idUser", idUser.toString());
	const postResponse = await axios.post(API_URL, ticket, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	const getResponse = await axios.get(API_URL);

	const createdTicket = postResponse.data.createdTicket;
	const allTickets = getResponse.data;

	return { createdTicket, allTickets };
};
export const userLogout = async () => {
	await axios.post(LOGOUT_URL);
};
