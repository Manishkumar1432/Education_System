# Education Platform - Backend

## Setup
1. Copy `.env.example` to `.env` and set values (or use defaults):
   - `MONGO_URI=mongodb://localhost:27017/education_platform`
   - `JWT_SECRET=your_jwt_secret`

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Run seed to create sample accounts:
   ```bash
   npm run seed
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

## API Overview
- Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/profile`
- Videos: `/api/videos` (teacher upload protected)
- Notes: `/api/notes` (teacher CRUD)
- Important Questions: `/api/questions`
- Quizzes: `/api/quizzes` (teacher CRUD)
- Results: `/api/results/:id/submit` (student submit), `/api/results/me` (student view)

All protected endpoints require `Authorization: Bearer <token>` header.

## Files
- `models/` - Mongoose schemas
- `controllers/` - Request handlers
- `routes/` - Express routes
- `middleware/auth.js` - JWT-based protection + role checks
- `utils/seed.js` - Seed sample data
