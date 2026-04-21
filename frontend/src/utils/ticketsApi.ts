import { apiClient } from "./clientApi";

const API_URL = import.meta.env.VITE_API_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
const TICKET_URL = import.meta.env.VITE_TICKET_URL;
type TicketStatus = "Ouvert" | "En cours" | "Fermé" | "Résolu";


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

export const assignTicket = async (idTicket: number, idSupport: number) => {
	const { data } = await apiClient.post(
		`${API_URL}/${idTicket}/assign`,
		{ idTicket, idSupport },
		{ withCredentials: true },
	);
	return data;
};
export const updateTicketStatus = async (
	ticketId: number,
	statusId: number,
) => {
	const response = await apiClient.patch(`${API_URL}/${ticketId}/status`, {
		statusId,
	});
	return response.data;
};

export const getTicketById = async (idTicket: number) => {
	const id = await apiClient.get(`${API_URL}/${idTicket}`);
	return id;
};

export const fetchTicketStatus = async (idTicket: number): Promise<string> => {
	const { data } = await apiClient.get(`${TICKET_URL}/${idTicket}`);
	return data.statusName as TicketStatus;
};


export const updateTicketConfirmation = async (idTicket: number): Promise<boolean> => {
	const { data } = await apiClient.patch(`${API_URL}/${idTicket}/confirm`);
	return data.hasAdminConfirmed;
};

export const fetchTicketConfirmation = async (idTicket: number): Promise<boolean> => {
	const { data } = await apiClient.get(`${TICKET_URL}/${idTicket}`);
	return data.hasAdminConfirmed ?? false;
};

