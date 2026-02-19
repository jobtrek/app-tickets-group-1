import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite");

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