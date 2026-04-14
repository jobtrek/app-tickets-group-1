export const ticketQueries = {
	getAll: `
      SELECT 
        t.id_ticket as idTicket,
        t.title,
        t.description,
        t.image,
        t.level,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        t.id_status as idStatus,
        t.id_user as idUser,
        u.username 
      FROM ticket t
      JOIN users u ON t.id_user = u.id_user
    `,
	getById: `
      SELECT 
        t.id_ticket as idTicket,
        t.title,
        t.description,
        t.image,
        t.level,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        t.id_status as idStatus,
        t.id_user as idUser
      FROM ticket t 
      WHERE t.id_ticket = ?
    `,
	insert: `
      INSERT INTO ticket (title, description, level, id_status, id_user)
      VALUES (?, ?, ?, ?, ?)
      RETURNING 
        id_ticket as idTicket,
        title,
        description,
        image,
        level,
        created_at as createdAt,
        updated_at as updatedAt,
        id_status as idStatus,
        id_user as idUser
    `,
} as const;

export const userQueries = {};
