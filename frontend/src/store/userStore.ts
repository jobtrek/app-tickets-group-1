import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
	id_user: number;
	username: string;
	email: string;
	setUser: (user: { id_user: number; username: string; email: string }) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			id_user: 0,
			username: "",
			email: "",
			setUser: (user) => set(user),
			clearUser: () => set({ id_user: 0, username: "", email: "" }),
		}),
		{ name: "user-storage" },
	),
);
