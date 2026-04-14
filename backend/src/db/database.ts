import { Database } from "bun:sqlite";

export const db = new Database(
	new URL("../data/mydb.sqlite", import.meta.url).pathname,
);

const createTableQuery = `

    CREATE TABLE IF NOT EXISTS status(
        id_status INTEGER PRIMARY KEY AUTOINCREMENT,
        status_name VARCHAR(50) NOT NULL,
        changed_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users(
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ticket(
        id_ticket INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        level VARCHAR(30),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        id_status VARCHAR(30),
        id_user INTEGER,
        id_support INTEGER DEFAULT NULL,
        FOREIGN KEY (id_user) REFERENCES users(id_user),
        FOREIGN KEY (id_support) REFERENCES users(id_user)
    );

    CREATE TABLE IF NOT EXISTS ticket_assignment (
        id_assignment INTEGER PRIMARY KEY AUTOINCREMENT,
        id_ticket INTEGER NOT NULL REFERENCES ticket(id_ticket),
        id_support INTEGER NOT NULL REFERENCES users(id_user),
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS cookies (
        id_cookie INTEGER PRIMARY KEY AUTOINCREMENT,
        session_token VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id_user),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS update_ticket_timestamp
    AFTER UPDATE ON ticket
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
        UPDATE ticket SET updated_at = CURRENT_TIMESTAMP WHERE id_ticket = NEW.id_ticket;
    END;

    INSERT INTO status (status_name) VALUES
        ('Ouvert'),
        ('En cours'),
        ('Fermé'),
        ('Résolu');

    INSERT INTO ticket_assignment (id_ticket, id_support, is_active) VALUES
        (1, 2, 1),
        (2, 3, 1),
        (3, 2, 1),
        (5, 3, 1),
        (6, 2, 1),
        (8, 3, 1),
        (9, 2, 1);
`;

db.run(createTableQuery);
