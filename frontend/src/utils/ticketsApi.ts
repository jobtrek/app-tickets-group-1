import { apiClient } from "./clientApi";
import type { Ticket } from "./types";

const API_URL = import.meta.env.VITE_API_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
const TICKET_URL = import.meta.env.VITE_TICKET_URL;

export const createTicketFromForm = async (
	ticket: FormData,
	idUser: number,
) => {
	ticket.append("idUser", idUser.toString());
	const postResponse = await apiClient.post(API_URL, ticket);
	return { createdTicket: postResponse.data.createdTicket };
};
export const userLogout = async () => {
	await apiClient.post(LOGOUT_URL);
};

export const createComment = async (commentText: string, idTicket: number) => {
	const { data } = await apiClient.post(`${API_URL}/${idTicket}/comment`, {
		commentText,
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
	const id = await apiClient.get(`${TICKET_URL}/${idTicket}`);
	return id;
};

export const updateTicketConfirmation = async (
	idTicket: number,
	value: boolean,
): Promise<boolean> => {
	const { data } = await apiClient.patch(`${API_URL}/${idTicket}/confirm`, {
		hasAdminConfirmed: value,
	});
	return data.hasAdminConfirmed;
};

export const fetchTicketConfirmation = async (
	idTicket: number,
): Promise<boolean> => {
	const { data } = await apiClient.get(`${TICKET_URL}/${idTicket}`);
	return data.hasAdminConfirmed ?? false;
};
export const ownerConfirmTicket = async (
	idTicket: number,
	accepted: boolean,
) => {
	const { data } = await apiClient.patch(
		`${API_URL}/${idTicket}/owner-confirm`,
		{ accepted },
	);
	return data;
};

// /api/tickets/:id/urgency
export const updateTicketUrgencyLevel = async (
	idTicket: number,
	level: Ticket["level"],
) => {
	const { data } = await apiClient.patch(`${API_URL}/${idTicket}/urgency`, {
		level,
	});
	return data;
};
