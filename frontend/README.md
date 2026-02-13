# Education Platform - Frontend

## Setup
1. Install deps:
   ```bash
   cd frontend
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

The dev server runs on http://localhost:3000 and proxies API requests to http://localhost:5000 (backend).

## Features
- Vite + React + React Router
- Tailwind CSS + Dark mode
- Framer Motion for animated sidebar and subtle interactions
- Auth context that stores JWT and sets Authorization header for API calls

## Next steps
- Add teacher pages for uploading content
- Implement quiz player and student result pages
- Polish responsive layout and animations
