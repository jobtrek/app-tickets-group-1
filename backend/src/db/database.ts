import { Database } from "bun:sqlite";

export const db = new Database("./backend/src/data/mydb.sqlite");

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
        created_at datetime default current_timestamp,
        updated_at datetime default current_timestamp,
        id_status integer,
        id_user integer,
        foreign key (id_status) references status(id_status),
        foreign key (id_user) references users(id_user)
    );

    create trigger if not exists update_ticket_timestamp
    after update on ticket
    for each row
    when new.updated_at = old.updated_at
    begin
      update ticket set updated_at = current_timestamp where id_ticket = new.id_ticket;
    end;

`;

db.run(createTableQuery);
