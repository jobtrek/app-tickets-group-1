export const CookieQuery = {
	create: `
    INSERT INTO cookies (session_token, user_id)
    VALUES (?, ?)
  `,
} as const;
