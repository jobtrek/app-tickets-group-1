export const ticketQueries = {
	getAll: `
      SELECT t.*
      FROM ticket t
    `,
	insert: `
      INSERT INTO ticket (title, description, level, id_status, id_user)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `,
} as const;
