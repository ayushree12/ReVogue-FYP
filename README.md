# Revogue

Revogue is a MERN monorepo for a sustainable thrift fashion marketplace. The client uses React + Vite + Tailwind, and the server uses Express + MongoDB + Socket.IO.

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Setup
1. Install dependencies once from the repository root:
   ```bash
   npm install
   ```
2. Create local env files from the provided examples:
   - `client/.env.example` -> `client/.env`
   - `server/.env.example` -> `server/.env`
3. Update `server/.env` with your real secrets and database connection.
4. Start both apps from the repository root:
   ```bash
   npm run dev
   ```

## macOS Notes
- The repo now uses npm workspaces, so one root `npm install` is enough on macOS and Windows.
- If you copied this folder from Windows to macOS, run `npm run reinstall` once before starting the app. That removes old `node_modules` folders and reinstalls platform-specific packages cleanly.

## Available Scripts
- `npm run dev` starts the server and client together.
- `npm run dev:server` starts only the API server.
- `npm run dev:client` starts only the Vite client.
- `npm run build` runs every workspace build script.
- `npm run test` runs all workspace tests once.
- `npm run clean` removes generated dependencies and build artifacts.
- `npm run reinstall` cleans generated artifacts and reinstalls dependencies.

## Environment Files

### `client/.env`
- `VITE_API_URL` defaults to `http://localhost:5000/api/v1`
- `VITE_SOCKET_URL` defaults to `http://localhost:5000`

### `server/.env`
- Required: `MONGO_URI`, `JWT_SECRET`, `ADMIN_PROMOTE_SECRET`
- Common local values are already included in `server/.env.example`
- Optional integrations: `CLOUDINARY_*`, `KHALTI_*`, `ESEWA_SERVICE_CODE`

## Testing
- Run `npm run test` from the repository root.
- Run `npm run test --workspace server` for server tests only.
- Run `npm run test --workspace client` for client tests only.

## Shipping Notes
- No admin user is seeded by default.
- Demo category data can be added with `node server/scripts/seedCategories.js`.
