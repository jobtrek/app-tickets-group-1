import axios from "axios";
import API_URL from "../../../src/config/api";

export const createTicketFromForm = async (
	ticket: FormData,
	id_user: number,
) => {
	const payload = {
		title: ticket.get("title"),
		description: ticket.get("description"),
		image: ticket.get("img") || null,
		level: ticket.get("urgence"),
		id_user: id_user,
	};
	const postResponse = await axios.post(API_URL, payload);
	const getResponse = await axios.get(API_URL);

	const createdTicket = postResponse.data;
	const allTickets = getResponse.data;

	return { createdTicket, allTickets };
};
