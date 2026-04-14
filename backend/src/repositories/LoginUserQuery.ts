export const LoginUserQuerie = {
	getByEmail: `
    SELECT id_user as id, username, email, password, role FROM users
    WHERE email = ?
  `,
} as const;
