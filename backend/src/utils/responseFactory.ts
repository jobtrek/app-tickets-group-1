import { corsHeaders, loginCorsHeaders } from "backend/src/utils/headers";

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
	details?: unknown,
): Response => {
	return Response.json(
		{ error: message, details },
		{ status, headers: loginCorsHeaders },
	);
};
