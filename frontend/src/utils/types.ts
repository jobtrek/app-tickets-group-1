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
