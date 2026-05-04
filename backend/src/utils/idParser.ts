import { corsHeaders } from "backend/src/utils/headers";

export const parseId = (id: string) => {
	const parsed = Number.parseInt(id, 10);
	return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
};
export const verifyAndParseId = (
	id: string,
	errorMessage: string,
): Response | number => {
	const parsed = Number.parseInt(id, 10);
	if (Number.isNaN(parsed) || parsed <= 0) {
		return new Response(errorMessage, { status: 400, headers: corsHeaders });
	}
	return parsed;
};
