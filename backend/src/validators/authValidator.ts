import * as v from "valibot";

export const UserRegisterSchema = v.object({
	username: v.pipe(
		v.string(),
		v.minLength(1, "Le nom d'utilisateur est requis"),
		v.maxLength(50, "Maximum 50 caractères"),
	),
	email: v.pipe(
		v.string(),
		v.email("L'adresse email n'est pas valide"),
		v.maxLength(100, "Maximum 100 caractères"),
	),
	password: v.pipe(
		v.string(),
		v.minLength(8, "Le mot de passe doit contenir au moins 8 caractères"),
		v.maxLength(255, "Le mot de passe est trop long"),
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
});

export type UserRegister = v.InferInput<typeof UserRegisterSchema>;
export type UserLogin = v.InferInput<typeof UserLoginSchema>;
export type UserGet = v.InferInput<typeof UserGetSchema>;
