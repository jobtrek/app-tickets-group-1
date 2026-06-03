import * as v from "valibot";

export const PasswordVerifySchema = v.object({
	password: v.pipe(v.string(), v.minLength(1, "Password is required")),
});
