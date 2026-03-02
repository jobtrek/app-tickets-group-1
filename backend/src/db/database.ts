import { Database } from 'bun:sqlite';

export const db = new Database('./mydb.sqlite');

const createTableQuery = `
    create table if not exists status(
        id_status integer primary key autoincrement,
        status_name varchar(50) not null,
        changed_at text default current_timestamp
    );

    create table if not exists users(
        id_user integer primary key autoincrement,
        username varchar(50) not null,
        email varchar(100) not null unique,
        password varchar(255) not null,
        role varchar(20) not null
    );

    create table if not exists ticket(
        id_ticket integer primary key autoincrement,
        title varchar(100) not null,
        description text not null,
        image text,
        level varchar(30),
        created_at text default current_timestamp,
        id_status integer,
        id_user integer,
        foreign key (id_status) references status(id_status),
        foreign key (id_user) references users(id_user)
    );
`;

db.run(createTableQuery);

const tickets = [
  ['Fix Login Button', "Button doesn't click on mobile", 'High', 1, 1],
  ['Update Logo', 'Use the new SVG logo in header', 'Low', 2, 2],
  ['Database Timeout', 'Intermittent 504 errors on search', 'Urgent', 1, 1],
  ['User Profile CSS', 'Alignment is off on tablet view', 'Medium', 2, 3],
  ['Add Export to PDF', 'Feature request for invoice page', 'Low', 1, 2],
  ['Security Patch', 'Update dependencies for CVE-2024', 'Urgent', 3, 1],
  ['Dark Mode Bug', 'Text remains black in dark mode', 'Medium', 2, 3],
  [
    'Email Notification',
    'Welcome email not sending to new users',
    'High',
    1,
    2,
  ],
  ['API Documentation', 'Swagger docs are missing new endpoints', 'Low', 4, 1],
  ['Optimize Images', 'Homepage loading too slowly', 'Medium', 2, 2],
];

const insertTicket = db.prepare(`
  INSERT INTO ticket (title, description, level, id_status, id_user)
  VALUES (?, ?, ?, ?, ?)
`);

for (const ticket of tickets) {
  insertTicket.run(...ticket);
}
