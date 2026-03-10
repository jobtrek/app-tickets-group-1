import { create } from "zustand";

interface UserStore {
	id_user: number;
	username: string;
	email: string;
	role?: string;
	setUser: (user: {
		id_user: number;
		username: string;
		email: string;
		role: string;
	}) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	id_user: 0,
	username: "",
	email: "",
	role: "",
	setUser: (user) => set(user),
	clearUser: () => set({ id_user: 0, username: "", email: "", role: "" }),
}));
