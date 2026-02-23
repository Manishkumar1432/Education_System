# EDUCATION PLATFORM - PROJECT DOCUMENTATION

**Project Name:** Education Platform  
**Version:** 1.0.0  
**Date:** February 20, 2026  
**Type:** Full-Stack Web Application (MERN Stack)

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Features](#features)
6. [Database Models](#database-models)
7. [API Routes](#api-routes)
8. [Frontend Pages & Components](#frontend-pages--components)
9. [User Roles](#user-roles)
10. [Installation & Running](#installation--running)
11. [Technologies Used](#technologies-used)
12. [Key Features Breakdown](#key-features-breakdown)

---

## PROJECT OVERVIEW

The **Education Platform** is a comprehensive Learning Management System (LMS) designed for students and teachers to collaborate in an interactive learning environment. 

### Main Objectives:
- Enable teachers to create and manage educational content (notes, videos, quizzes)
- Allow students to access, search, and learn from this content
- Provide interactive quiz assessments with time limits and auto-submit
- Display student performance results and analytics
- Support user profiles with avatar uploads
- Enable teachers to view all student results and export reports to PDF

### Target Users:
- **Teachers:** Create content, manage quizzes, view student results
- **Students:** Access content, take quizzes, track performance

---

## ARCHITECTURE

### Overall Structure:
```
Education/
├── backend/          # Node.js/Express REST API
├── frontend/         # React + Vite SPA
└── PROJECT_DOCUMENTATION.md
```

### Tech Stack:
- **Backend:** Node.js, Express, MongoDB (Mongoose ODM)
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary (cloud-based media hosting)
- **PDF Export:** jsPDF + html2canvas

---

## BACKEND SETUP

### Directory Structure:
```
backend/
├── server.js                 # Main entry point
├── package.json
├── .env                      # Environment variables
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   ├── auth.js               # JWT authentication & role authorization
│   └── multer.js             # File upload handling
├── models/
│   ├── User.js               # User schema (name, email, password, role, profile)
│   ├── Quiz.js               # Quiz schema (title, description, questions, duration)
│   ├── QuizResult.js         # Quiz result schema (score, answers, student, quiz)
│   ├── Note.js               # Note schema (title, content, tags, file)
│   ├── Video.js              # Video schema (title, description, tags, video file)
│   └── ImportantQuestion.js  # Important question schema
├── controllers/
│   ├── authController.js     # User signup, login, profile management
│   ├── quizController.js     # Quiz CRUD operations
│   ├── resultController.js   # Quiz result submission and retrieval
│   ├── noteController.js     # Note CRUD operations
│   ├── videoController.js    # Video CRUD operations
│   ├── questionController.js # Important question CRUD operations
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── quizzes.js            # Quiz routes
│   ├── results.js            # Result routes
│   ├── notes.js              # Note routes
│   ├── videos.js             # Video routes
│   └── questions.js          # Question routes
└── utils/
    ├── cloudinary.js         # Cloudinary configuration
    └── seed.js               # Database seeding script
```

### Environment Variables (.env):
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

### Database Models:

#### User Model:
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'teacher'], required),
  profile: {
    bio: String,
    avatar: String (Cloudinary URL)
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Quiz Model:
```javascript
{
  title: String (required),
  description: String,
  teacher: ObjectId (ref: User),
  questions: [
    {
      text: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  durationMinutes: Number (quiz time limit),
  createdAt: Date,
  updatedAt: Date
}
```

#### QuizResult Model:
```javascript
{
  quiz: ObjectId (ref: Quiz),
  student: ObjectId (ref: User),
  answers: [
    {
      questionId: ObjectId,
      answerIndex: Number
    }
  ],
  score: Number (percentage 0-100),
  createdAt: Date,
  updatedAt: Date
}
```

#### Note Model:
```javascript
{
  title: String (required),
  content: String (required),
  teacher: ObjectId (ref: User),
  tags: [String],
  filePath: String (optional attachment),
  createdAt: Date,
  updatedAt: Date
}
```

#### Video Model:
```javascript
{
  title: String (required),
  description: String,
  teacher: ObjectId (ref: User),
  videoPath: String (Cloudinary URL),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## FRONTEND SETUP

### Directory Structure:
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # React entry point
│   ├── index.css             # Global styles
│   ├── components/
│   │   ├── Header.jsx        # Top navigation bar
│   │   ├── AnimatedSidebar.jsx # Sidebar navigation
│   │   └── ProtectedRoute.jsx # Role-based route protection
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state (user, token, login, signup, logout)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Signup.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx       # User profile & avatar upload
│   │   ├── Notes.jsx         # Notes list with search
│   │   ├── Videos.jsx        # Videos list with search
│   │   ├── Quizzes.jsx       # Quizzes list with search
│   │   ├── QuizDetail.jsx    # Quiz attempt with timer & results
│   │   ├── TeacherDashboard.jsx # Teacher content management
│   │   ├── TeacherResults.jsx # Teacher results view & PDF export
│   │   ├── StudentDashboard.jsx # Student performance dashboard
│   │   ├── ImportantQuestions.jsx # Important questions page
│   │   ├── VideoDetail.jsx   # Video player
│   ├── services/
│   │   └── api.js            # Axios API client configuration
```

### Key Configuration Files:

**vite.config.js:**
- Vite build tool configuration
- React plugin enabled
- Dev server proxy setup

**tailwind.config.js:**
- Tailwind CSS customization
- Dark mode support
- Custom theme colors

**postcss.config.js:**
- PostCSS plugins for Tailwind processing

---

## FEATURES

### 1. Authentication & User Management
- ✅ User signup (student/teacher role selection)
- ✅ User login with JWT token
- ✅ Profile management (name, bio, avatar)
- ✅ Avatar upload to Cloudinary
- ✅ Protected routes by user role
- ✅ Token-based authentication

### 2. Quiz System
- ✅ Create quizzes with multiple questions (up to 20)
- ✅ Multiple choice questions (4 options each)
- ✅ Quiz time limit (durationMinutes)
- ✅ Countdown timer with visual circular progress
- ✅ Auto-submit when time expires
- ✅ Disable inputs after submission/timeout
- ✅ Score calculation as percentage
- ✅ Beautiful result display with performance levels
- ✅ Answer review showing correct vs student answers

### 3. Notes Management
- ✅ Create notes with title, content, and tags
- ✅ Optional file attachments (PDF, DOC, DOCX, TXT, etc.)
- ✅ Edit/delete notes (owner only)
- ✅ Search notes by title, content, or tags
- ✅ Display notes in list view

### 4. Video Management
- ✅ Upload videos with title, description, tags
- ✅ Edit/delete videos (owner only)
- ✅ Search videos by title, description, or tags
- ✅ Video playback in detail page
- ✅ Grid layout display

### 5. Important Questions
- ✅ Create important questions with explanations
- ✅ Categorize by subject
- ✅ Edit/delete questions (owner only)
- ✅ Teacher dashboard for question management

### 6. Search & Filter
- ✅ Global header search (notes, videos, quizzes)
- ✅ Per-page search on Notes, Videos, Quizzes pages
- ✅ Client-side filtering by title, content, tags
- ✅ Search by student name/email (teacher results)
- ✅ Quiz filter by quiz name (teacher results)

### 7. Teacher Results Dashboard
- ✅ View all student results for teacher's quizzes
- ✅ Filter results by quiz or student
- ✅ Display summary stats (total submissions, avg score, excellent/needs help counts)
- ✅ Color-coded performance status
- ✅ Results table with student details, score, date

### 8. PDF Export (In Development)
- 📋 Export results as PDF (requires jsPDF & html2canvas installation)
- 📋 Include report header with date and teacher name
- 📋 Embed statistics and results table in PDF

### 9. User Interface
- ✅ Dark mode / Light mode toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Animated sidebar navigation
- ✅ Beautiful cards with hover effects
- ✅ Smooth transitions and animations (Framer Motion)

---

## API ROUTES

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| POST | `/auth/signup` | ❌ | - | User registration |
| POST | `/auth/login` | ❌ | - | User login |
| GET | `/auth/profile` | ✅ | Any | Get current user profile |
| PUT | `/auth/profile` | ✅ | Any | Update user profile |

### Quiz Routes (`/api/quizzes`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/quizzes` | ❌ | - | Get all quizzes |
| GET | `/quizzes/:id` | ❌ | - | Get specific quiz |
| POST | `/quizzes` | ✅ | teacher | Create new quiz |
| PUT | `/quizzes/:id` | ✅ | teacher | Update quiz (owner) |
| DELETE | `/quizzes/:id` | ✅ | teacher | Delete quiz (owner) |

### Results Routes (`/api/results`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| POST | `/results/:id/submit` | ✅ | student | Submit quiz answers |
| GET | `/results/me` | ✅ | student | Get student's results |
| GET | `/results/teacher` | ✅ | teacher | Get all results for teacher's quizzes |

### Notes Routes (`/api/notes`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/notes` | ❌ | - | Get all notes |
| GET | `/notes/:id` | ❌ | - | Get specific note |
| POST | `/notes` | ✅ | teacher | Create note |
| PUT | `/notes/:id` | ✅ | teacher | Update note (owner) |
| DELETE | `/notes/:id` | ✅ | teacher | Delete note (owner) |

### Video Routes (`/api/videos`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/videos` | ❌ | - | Get all videos |
| GET | `/videos/:id` | ❌ | - | Get specific video |
| POST | `/videos` | ✅ | teacher | Upload video |
| PUT | `/videos/:id` | ✅ | teacher | Update video (owner) |
| DELETE | `/videos/:id` | ✅ | teacher | Delete video (owner) |

### Questions Routes (`/api/questions`)
| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/questions` | ❌ | - | Get all questions |
| POST | `/questions` | ✅ | teacher | Create question |
| PUT | `/questions/:id` | ✅ | teacher | Update question (owner) |
| DELETE | `/questions/:id` | ✅ | teacher | Delete question (owner) |

---

## FRONTEND PAGES & COMPONENTS

### Components

#### Header.jsx
- Top navigation bar with branding
- User greeting and logout button
- Dark/Light mode toggle
- Global search input (searches notes, videos, quizzes)
- Responsive design

#### AnimatedSidebar.jsx
- Animated menu toggle
- Navigation links to all pages
- Role-based links (teacher/student dashboards)
- Smooth animations with Framer Motion

#### ProtectedRoute.jsx
- Route wrapper for role-based access control
- Redirects unauthorized users
- Supports role specification (student/teacher)

### Pages

#### Home.jsx
- Landing page with platform overview
- Call-to-action buttons (Signup/Login)

#### Signup.jsx
- User registration form
- Name, email, password inputs
- Student/Teacher role selection
- Input validation

#### Login.jsx
- User authentication form
- Email and password fields
- Error handling

#### Profile.jsx
- Display user name, email, role
- Edit profile (name, bio)
- Avatar upload with preview
- Cloudinary integration for avatars

#### Notes.jsx
- List of all notes with pagination
- Search bar for filtering notes
- Create note form (teacher only)
- Edit/delete buttons (owner only)
- Download attachment links

#### Videos.jsx
- Grid display of all videos
- Search and filter functionality
- Upload video form (teacher only)
- Edit/delete buttons (owner only)
- Link to video player

#### Quizzes.jsx
- Display available quizzes
- Search and filter
- Create/edit quiz (teacher only)
- Attempt quiz button (student)
- Edit/delete buttons (teacher owner)

#### QuizDetail.jsx
- Quiz attempt interface for students
- Display all quiz questions with options
- Radio button selection for answers
- Animated circular countdown timer
- Auto-submit on time expiry
- Beautiful results display with:
  - Percentage score with circular progress visualization
  - Correct/incorrect count
  - Performance level badge
  - Question-by-question review

#### TeacherDashboard.jsx
- Create and manage important questions
- Edit/delete questions (owner only)
- Display questions in animated cards
- Search and filter questions

#### TeacherResults.jsx
- View all student results
- Filter results by quiz
- Search by student name/email
- Summary statistics (submissions, avg score, excellent/needs help)
- Color-coded performance table
- Export results to PDF (when jsPDF installed)

#### StudentDashboard.jsx
- Student performance overview
- View past quiz attempts
- Performance analytics

#### ImportantQuestions.jsx
- Display all important questions
- Filter by subject
- Show explanations
- Edit/delete (teacher/owner)

#### VideoDetail.jsx
- Full-screen video player
- Video title and description
- Video metadata display

---

## USER ROLES

### Student Role
**Permissions:**
- View and search all notes, videos, quizzes
- Attempt quizzes and submit answers
- View personal quiz results
- Access student dashboard
- Edit own profile

**Restrictions:**
- Cannot create/edit/delete content
- Cannot view other students' detailed results
- Cannot access teacher dashboard

### Teacher Role
**Permissions:**
- Create/edit/delete notes, videos, quizzes
- Create and manage important questions
- View all student results for their quizzes
- Export results to PDF
- Filter and search student results
- Access teacher dashboard
- Edit own profile

**Restrictions:**
- Cannot delete other teachers' content
- Cannot modify student quiz submissions directly

---

## INSTALLATION & RUNNING

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for file uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/education
JWT_SECRET=your_super_secret_key_here
TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

4. Run development server:
```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173` (or shown in terminal)

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

---

## TECHNOLOGIES USED

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Security:** Helmet, CORS
- **HTTP Logging:** Morgan
- **Development:** Nodemon

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **State Management:** React Context API

### DevDependencies
- PostCSS & Autoprefixer (CSS processing)
- Tailwind CSS (utility-first CSS)
- ESLint (code linting, if configured)

---

## KEY FEATURES BREAKDOWN

### 1. Quiz Timer System
**Implementation:**
- Store `durationMinutes` in Quiz model
- Frontend initializes countdown on quiz load
- Updates timer every second
- Color changes based on remaining time (green → yellow → red)
- Auto-submit when timer reaches 0
- Prevent double submissions with ref guard

**User Experience:**
- Circular progress ring showing time visually
- MM:SS format display
- "Hurry up!" warning when ≤20% time remains
- Cannot modify answers after time expires

### 2. Search Functionality
**Global Header Search:**
- Client-side filters from preloaded items
- Debounced input (200ms)
- Shows dropdown with matched results
- Click result navigates directly

**Per-Page Search:**
- Available on notes, videos, quizzes pages
- Instant filtering as user types
- Searches title, content, tags, description
- No server round-trip needed

### 3. Results Management
**Teacher Results Dashboard:**
- Aggregates all student submissions for teacher's quizzes
- Sortable and filterable table
- Real-time statistics calculation
- Color-coded status badges
- Optional PDF export

**Student Results:**
- Personal result history
- Performance tracking
- Question review with correct answers

### 4. File Upload System
**Avatar Upload:**
- Cloudinary integration
- Auto-resized to 400x400px
- Stored as secure HTTPS URL
- Cached in user profile

**Note/Video Upload:**
- File validation by MIME type
- Stored in Cloudinary
- Accessible via direct URLs
- Download links for students

### 5. Authentication Flow
**Signup:**
1. User fills form with name, email, password, role
2. Backend hashes password with bcryptjs
3. Create user in MongoDB
4. Generate JWT token
5. Store token in localStorage
6. Redirect to home page

**Login:**
1. User provides email and password
2. Backend queries user by email
3. Compare hashed password using bcryptjs
4. Generate JWT on match
5. Store token in localStorage
6. AuthContext updates global state

**Protected Routes:**
- Verify token on page load
- Fetch user profile from `/auth/profile`
- Redirect to login if unauthorized
- Check role if endpoint requires specific role

---

## FUTURE ENHANCEMENTS

Potential features for future versions:
- [ ] Video streaming optimization (adaptive bitrate)
- [ ] Real-time quiz collaboration
- [ ] Student progress tracking with charts
- [ ] Assignment submission system
- [ ] Forum/discussion boards
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Payment integration for premium courses
- [ ] Certificate generation

---

## MAINTENANCE & SUPPORT

### Common Issues & Solutions

**MongoDB Connection Error:**
- Verify MONGO_URI in .env
- Check network IP whitelist in MongoDB Atlas
- Ensure cluster is active

**Cloudinary Upload Fails:**
- Verify API credentials in .env
- Check file size limits
- Ensure CORS is properly configured

**Frontend Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Rebuild: `npm run build`

**Port Already in Use:**
- Backend: Change PORT in .env
- Frontend: Vite will use next available port

---

## CONTACT & DOCUMENTATION

For more information, refer to individual component documentation and inline code comments.

**Project Structure:**
- Backend API: `/backend`
- Frontend App: `/frontend`
- Documentation: This file

---

**Last Updated:** February 20, 2026  
**Version:** 1.0.0
