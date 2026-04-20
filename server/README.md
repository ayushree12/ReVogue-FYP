# Revogue Server

Express API with Socket.IO supporting JWT auth, marketplace flows, payments, and admin moderation.

## Environment
Copy `server/.env.example` to `server/.env` and set:

- `MONGO_URI`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `ADMIN_PROMOTE_SECRET`
- `CLIENT_URL` for CORS
- Optional `CLOUDINARY_*`, `KHALTI_*`, `ESEWA_SERVICE_CODE`

## Scripts
- `npm run dev` starts the server with nodemon.
- `npm run start` starts the server with Node.
- `npm run test` runs Jest once.
- `node scripts/seedCategories.js` seeds demo categories.

For the full app on macOS or Windows, install dependencies from the repository root with `npm install`, then run `npm run dev`.
