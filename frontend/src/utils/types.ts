export interface Ticket {
	idTicket: number;
	title: string;
	description: string;
	image: string | null;
	level: "bas" | "moyen" | "haut" | "urgent";
	createdAt: string;
	updatedAt: string;
	statusName: "Ouvert" | "En cours" | "Fermé" | "Résolu";
	idUser: number;
	username: string;
	supportUsername: string;
}

export interface RegisterData {
	username: string;
	email: string;
	password: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface TicketViewProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: Ticket["level"];
	username: string;
	statusName: Ticket["statusName"];
	supportUsername: string | null;
}

export interface Comment {
	idComment: number;
	authorId: number;
	authorName: string;
	commentText: string;
	createdAt: string;
	authorRole: string;
}

export const urgencyColor: Record<Ticket["level"], string> = {
	urgent: "text-red-500 font-semibold",
	haut: "text-orange-500 font-semibold",
	moyen: "text-gray-700",
	bas: "text-gray-400",
};
