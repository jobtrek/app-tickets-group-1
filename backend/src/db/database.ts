import { Database } from "bun:sqlite";

export const db = new Database("./backend/src/data/mydb.sqlite");

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
        ('En attente'),
        ('Résolu');

    INSERT INTO users (username, email, password, role) VALUES
        ('john_doe', 'john@example.com', 'hashed_password_1', 'admin'),
        ('jane_smith', 'jane@example.com', 'hashed_password_2', 'support'),
        ('bob_jones', 'bob@example.com', 'hashed_password_3', 'support'),
        ('alice_wonder', 'alice@example.com', 'hashed_password_4', 'user'),
        ('charlie_brown', 'charlie@example.com', 'hashed_password_5', 'user'),
        ('diana_prince', 'diana@example.com', 'hashed_password_6', 'user'),
        ('peter_parker', 'peter@example.com', 'hashed_password_7', 'user');

    INSERT INTO ticket (title, description, image, level, id_status, id_user, id_support) VALUES
        ('Login page broken', 'Users cannot log in after the latest update.', NULL, 'urgent', 'Ouvert', 4, 2),
        ('Dashboard not loading', 'The dashboard shows a blank screen on Firefox.', NULL, 'moyen', 'En cours', 5, 3),
        ('Email notifications failing', 'Users are not receiving email confirmations.', NULL, 'haut', 'Ouvert', 6, 2),
        ('Profile picture upload fails', 'Uploading an image larger than 2MB throws a 500 error.', NULL, 'bas', 'Fermé', 4, NULL),
        ('Password reset link expired', 'Reset links expire too quickly.', NULL, 'moyen', 'En attente', 7, 3),
        ('Search returns no results', 'Search bar returns empty results for valid queries.', NULL, 'haut', 'En cours', 5, 2),
        ('Dark mode not saving', 'Dark mode preference resets on every page reload.', NULL, 'bas', 'Résolu', 6, NULL),
        ('Payment gateway timeout', 'Checkout process times out after 30 seconds.', NULL, 'urgent', 'Ouvert', 4, 3),
        ('CSV export broken', 'Exporting data to CSV produces an empty file.', NULL, 'moyen', 'En cours', 7, 2),
        ('Mobile layout broken', 'Buttons overlap on screens smaller than 375px.', NULL, 'bas', 'Fermé', 5, NULL);

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
