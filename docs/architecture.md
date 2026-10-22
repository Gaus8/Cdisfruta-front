# Frontend architecture

The React app keeps `src/routes/AppRouter.jsx` as the route declaration point. Route path strings are unchanged; public, auth, user, and admin views live under `src/pages`.

Shared page chrome and dialogs live in `src/components`. The Axios client and API services are under `src/services/api`, with `VITE_API_URL` ending in `/api` (see `.env.example`). Static files in `public/img` and `public/videos` retain their existing URL paths.

Vite uses React and Tailwind plugins configured in `vite.config.js`. Imports remain relative; there are no configured path aliases.
