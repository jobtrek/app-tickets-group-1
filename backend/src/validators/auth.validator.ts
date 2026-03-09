import * as v from "valibot";

export const UserRegisterSchema = v.object({
	username: v.pipe(
		v.string(),
		v.minLength(1, "Username is required"),
		v.maxLength(50, "Username must be 50 characters or less"),
	),
	email: v.pipe(
		v.string(),
		v.email("Invalid email address"),
		v.maxLength(100, "Email must be 100 characters or less"),
	),
	password: v.pipe(
		v.string(),
		v.minLength(8, "Password must be at least 8 characters"),
		v.maxLength(255, "Password must be 255 characters or less"),
	),
	role: v.pipe(
		v.string(),
		v.minLength(1, "Role is required"),
		v.maxLength(20, "Role must be 20 characters or less"),
	),
});

export const UserLoginSchema = v.object({
	email: v.pipe(v.string(), v.email("Invalid email address"), v.maxLength(100)),
	password: v.pipe(
		v.string(),
		v.minLength(1, "Password is required"),
		v.maxLength(255),
	),
});

export const UserGetSchema = v.object({
	idUser: v.number(),
	username: v.pipe(v.string(), v.maxLength(50)),
	email: v.pipe(v.string(), v.email(), v.maxLength(100)),
	role: v.pipe(v.string(), v.maxLength(20)),
});

export type UserRegister = v.InferInput<typeof UserRegisterSchema>;
export type UserLogin = v.InferInput<typeof UserLoginSchema>;
export type UserGet = v.InferInput<typeof UserGetSchema>;
