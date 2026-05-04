import { corsHeaders } from "backend/src/utils/headers";

export const parseId = (id: string) => {
	return Number(id);
};

export const verifyAndParseId = (
	id: string,
	errorMessage: string,
): Response | number => {
	const parsed = Number(id);
	if (Number.isNaN(parsed)) {
		return new Response(errorMessage, { status: 400, headers: corsHeaders });
	}
	return parsed;
};
