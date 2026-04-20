import { create } from "zustand";

interface ErrorStore {
	error: string | null;
	setError: (msg: string) => void;
	clearError: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
	error: null,
	setError: (msg) => set({ error: msg }),
	clearError: () => set({ error: null }),
}));
