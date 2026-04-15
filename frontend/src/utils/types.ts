export interface Ticket {
	idTicket: number;
	title: string;
	description: string;
	image: string | null;
	level: "bas" | "moyen" | "haut" | "urgent";
	createdAt: string;
	updatedAt: string;
	idStatus: "Ouvert" | "En cours" | "Fermé" | "Résolu";
	idUser: number;
	username: string;
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
