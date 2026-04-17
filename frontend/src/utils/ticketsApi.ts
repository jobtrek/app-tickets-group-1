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
	const payload = {
		title: ticket.get("title"),
		description: ticket.get("description"),
		image: ticket.get("img") || null,
		level: ticket.get("urgence") || undefined,
		idUser: idUser,
	};
	const postResponse = await axios.post(API_URL, payload);
	const getResponse = await axios.get(API_URL);

	const createdTicket = postResponse.data.createdTicket;
	const allTickets = getResponse.data;

	return { createdTicket, allTickets };
};
export const userLogout = async () => {
	await axios.post(LOGOUT_URL);
};

export const createComment = async (
	commentText: string,
	idUser: number,
	idTicket: number,
) => {
	const { data } = await axios.post(`${API_URL}/${idTicket}/comment`, {
		commentText,
		idUser,
		idTicket,
	});

	return data;
};
export const getComments = async (idTicket: number) => {
	const { data } = await axios.get(`${API_URL}/${idTicket}/comment`);
	return data;
};
