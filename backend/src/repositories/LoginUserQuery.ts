export const LoginUserQuerie = {
	getByEmail: `
    SELECT * FROM users 
    WHERE email = ?
  `,
} as const;
