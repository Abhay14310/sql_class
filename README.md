# SQLClass User Management App

A small Express and MySQL application for creating, viewing, editing, and deleting users.

## Setup

1. Install dependencies with `npm install`.
2. Create the `delta_app` database and run the statements in `schema.sql`.
3. Copy `.env.example` to `.env` and set your local MySQL password.
4. Start the server with `npm start`.

Open `http://localhost:8080` in a browser.

`.env` is ignored by Git and must not be committed. Use `.env.example` to document the required settings.

## Project layout

- `index.js`: Express routes and MySQL connection
- `views/`: EJS templates
- `schema.sql`: database setup statements
- `playground-*.mongodb.js`: MongoDB practice scripts