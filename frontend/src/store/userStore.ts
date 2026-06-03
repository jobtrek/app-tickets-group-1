import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
	idUser: number;
	username: string;
	email: string;
	role: string;
	isVerified: boolean;
	setUser: (user: {
		idUser: number;
		username: string;
		email: string;
		role: string;
	}) => void;
	clearUser: () => void;
	setVerified: () => void;
	clearVerified: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			idUser: 0,
			username: "",
			email: "",
			role: "",
			isVerified: false,
			setUser: (user) => set(user),
			clearUser: () =>
				set({
					idUser: 0,
					username: "",
					email: "",
					role: "",
					isVerified: false,
				}),
			setVerified: () => set({ isVerified: true }),
			clearVerified: () => set({ isVerified: false }),
		}),
		{ name: "user-storage" },
	),
);
