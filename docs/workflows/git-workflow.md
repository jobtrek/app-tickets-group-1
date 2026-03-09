all commit and branches must follow the git conventional commit format. For example, a commit message should look like this:

```feat: add user authentication
This commit adds a new authentication system using JWT tokens. Users can now register and log in to access protected routes.
``` 

## Backend file structure and flow
The backend will be organized into several folders to separate concerns and improve maintainability. The main folders will be:
- `middleware`: This will contain the entry point for the server, where we set up Bun.serve() and import routes.
- `routes`: This will contain route definitions, where we specify the endpoints and the corresponding controller functions.
- `controllers`: This will contain the business logic for handling requests, such as processing data and interacting with the database.
- `repository`: This will contain database query functions, which will be called by the controllers to perform CRUD operations on the database.
- `db`: This will contain the database connection setup and schema definitions.
- `data`: This will contain the actual database files (e.g., SQLite files).

## frontend file structure and flow
The frontend will be organized into several folders as well:
- `components`: This will contain reusable React components, such as buttons, forms, and UI elements.
- `pages`: This will contain the main page components that correspond to different routes in the application (e.g., Dashboard, TicketView).
- `routes`: This will contain the route definitions using React Router, where we specify the paths and the corresponding page components.
- `config`: This will contain configuration files, such as API URLs and environment variables.
- `assets`: This will contain static assets like images, icons, and stylesheets.

## Git workflow
To ensure a smooth development process, we will follow a Git workflow that includes the following steps:
1. **Branching**: Each feature or bug fix will be developed in a separate branch. Branch names should follow the format `feature/feature-name` or `bugfix/bug-description`.
2. **Commits**: Commits should be small and focused, with clear messages that follow the conventional commit format (e.g., `feat: add user authentication`).
3. **Pull Requests**: Once a feature or bug fix is complete, a pull request (PR) should be created to merge the changes into the main branch. The PR should include a description of the changes and any relevant information for reviewers.
4. **Code Review**: Team members should review the PR, providing feedback and requesting changes if necessary. Once the PR is approved, it can be merged into the main branch, there should be atleast 1 reviewer approving the PR before merging.
5. **Testing**: After merging, the changes should be tested to ensure that everything works as expected and that no new issues have been introduced.


## Git tips and tricks

1. Use `git rebase origin/main` to keep your branch up to date with the latest changes from the main branch before creating a PR.
2. Use `git stash` to temporarily save changes that are not ready to be committed, allowing you to switch branches without losing your work.

