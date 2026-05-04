import { errorResponse } from "./responseFactory";
export const parseId = (id: string) => {
	const parsed = Number.parseInt(id, 10);
	return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
};
export const verifyAndParseId = (
	id: string,
	errorMessage: string,
): Response | number => {
	const parsed = parseId(id);
	if (!parsed) {
		return errorResponse(errorMessage, 400);
	}
	return parsed;
};
