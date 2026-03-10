export const userQueries = {
	insertUser: `
    insert into users (username, email, password, role) values (?,?,?,?) returning *
  `,
};
