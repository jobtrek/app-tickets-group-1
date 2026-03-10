import { create } from "zustand";

interface UserStore {
	username: string;
	email: string;
	role?: string;
	setUser: (user: { username: string; email: string; role: string }) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	username: "",
	email: "",
	role: "",
	setUser: (user) => set(user),
	clearUser: () => set({ username: "", email: "", role: "" }),
}));
