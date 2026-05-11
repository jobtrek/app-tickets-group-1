export interface UserRow {
	id: number;
	email: string;
	password: string;
	username: string;
}

export interface UserResult {
	idUser: number;
	username: string;
	email: string;
}

export type TicketFilters = {
	sort?: "asc" | "desc";
	status?: string[];
	level?: string[];
};
