import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
	idUser: number;
	username: string;
	email: string;
	role: string;
	setUser: (user: {
		idUser: number;
		username: string;
		email: string;
		role: string;
	}) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			idUser: 0,
			username: "",
			email: "",
			role: "",
			setUser: (user) => set(user),
			clearUser: () => set({ idUser: 0, username: "", email: "", role: "" }),
		}),
		{ name: "user-storage" },
	),
);
