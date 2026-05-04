const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const corsHeaders = {
	"Access-Control-Allow-Origin": FRONTEND_URL,
	"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Prefer, Authorization",
	"Access-Control-Allow-Credentials": "true",
	"Content-Type": "application/json",
};

export const loginCorsHeaders = {
	"Access-Control-Allow-Origin": FRONTEND_URL,
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true",
	"Content-Type": "application/json",
};
