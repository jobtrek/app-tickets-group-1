import { corsHeaders, loginCorsHeaders } from "./headers";

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
export const jsonResponse = (
	data: unknown,
	status: number = 200,
	headers?: HeadersInit,
): Response => {
	const mergedHeaders = new Headers(corsHeaders);
	if (headers) {
		new Headers(headers).forEach((value, key) => {
			mergedHeaders.set(key, value);
		});
	}
	return Response.json(data, { status, headers: mergedHeaders });
};

export const errorResponse = (
	message: string,
	status: number = 500,
): Response => {
	return new Response(message, { status, headers: corsHeaders });
};

export const loginResponseError = (
	message: string,
	status: number = 400,
): Response => {
	return Response.json(message, { status, headers: loginCorsHeaders });
};
