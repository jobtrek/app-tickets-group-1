export const ticketQueries = {
	getAll: `
      SELECT t.*, u.username 
FROM ticket t
JOIN users u ON t.id_user = u.id_user
    `,
	insert: `
      INSERT INTO ticket (title, description, level, id_status, id_user)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `,
} as const;

export const userQueries = {};
