import { redirect } from "@tanstack/react-router";

export type SessionUser = {
	idUser: number;
	username: string;
	email: string;
	role: string;
};

// Uses native fetch (not the axios client) so the 401 interceptor doesn't
// navigate away before beforeLoad can throw its own redirect.
export const checkSession = async (): Promise<SessionUser> => {
	const origin = new URL(import.meta.env.VITE_API_URL).origin;
	const res = await fetch(`${origin}/api/me`, { credentials: "include" });
	if (!res.ok) throw redirect({ to: "/login" });
	return res.json() as Promise<SessionUser>;
};
