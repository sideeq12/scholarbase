# Scholarbase API

A comprehensive REST API for the Scholarbase learning platform built with Express.js and TypeScript. Provides endpoints for authentication, course management, user profiles, and enrollment functionality.

## 🚀 Features

- **Authentication System**: Complete user registration, login, password reset, and email verification
- **Course Management**: Browse, search, filter, and retrieve course information
- **User Profiles**: Student profile creation and management
- **Enrollment System**: Course enrollment, unenrollment, and enrollment tracking
- **RESTful Design**: Clean, consistent API following REST principles
- **Swagger Documentation**: Interactive API documentation with try-it-out functionality
- **TypeScript**: Full type safety and better developer experience
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Usage Examples](#usage-examples)
- [Development](#development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sbApi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

## 📚 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/signup` | Register new user |
| POST   | `/auth/signin` | User login |
| POST   | `/auth/signout` | User logout |
| POST   | `/auth/forgot-password` | Request password reset |
| POST   | `/auth/reset-password` | Reset password with token |
| POST   | `/auth/verify-email` | Verify email address |
| GET    | `/auth/me` | Get current user profile |

### Courses (`/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/courses` | Get all courses with filtering |
| GET    | `/courses/featured` | Get featured courses |
| GET    | `/courses/categories` | Get all categories |
| GET    | `/courses/category/:category` | Get courses by category |
| GET    | `/courses/search` | Search courses |
| GET    | `/courses/:id` | Get course by ID |
| GET    | `/courses/:id/similar` | Get similar courses |

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users/profile/:userId` | Get user profile |
| PUT    | `/users/profile/:userId` | Update user profile |
| GET    | `/users/:userId/enrollments` | Get user enrollments |
| POST   | `/users/create-profile` | Create student profile |
| GET    | `/users/search` | Search users (admin) |
| GET    | `/users/stats` | Get user statistics (admin) |

### Enrollments (`/enrollments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/enrollments` | Create new enrollment |
| GET    | `/enrollments/student/:studentId` | Get student enrollments |
| GET    | `/enrollments/course/:courseId` | Get course enrollments |
| GET    | `/enrollments/check` | Check enrollment status |
| GET    | `/enrollments/:enrollmentId` | Get enrollment details |
| DELETE | `/enrollments/:enrollmentId` | Remove enrollment |
| POST   | `/enrollments/student/:studentId/unenroll` | Unenroll from course |
| GET    | `/enrollments/course/:courseId/count` | Get enrollment count |
| GET    | `/enrollments/stats` | Get enrollment statistics |

## 🔐 Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example Login Flow

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123",
       "firstName": "John",
       "lastName": "Doe"
     }'
   ```

2. **Sign in:**
   ```bash
   curl -X POST http://localhost:3000/auth/signin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
   ```

## 📊 Data Models

### Course
```typescript
interface Course {
  id: string
  title: string
  description?: string
  instructor: string
  author: string
  price: number
  original_price?: number
  rating?: number
  review_count?: number
  student_count?: number
  thumbnail?: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  featured?: boolean
  is_published?: boolean
  created_at?: string
  duration_hours?: number
  lesson_count?: number
  tags?: string[]
}
```

### Student
```typescript
interface Student {
  id: string
  First_name: string
  Last_name: string
  email: string
  display_name?: string
  academic_level?: string
  profile_picture?: string
  created_at?: string
}
```

### Enrollment
```typescript
interface Enrollment {
  id: string
  created_at: string
  student_id: string
  course_id: string
  tutor_id?: string
}
```

## 💡 Usage Examples

### Get All Courses with Filters
```bash
curl "http://localhost:3000/courses?category=Programming&level=Beginner&limit=10"
```

### Search Courses
```bash
curl "http://localhost:3000/courses/search?q=javascript&limit=5"
```

### Enroll in a Course
```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "student_id": "user_123",
    "course_id": "course_1"
  }'
```

### Check Enrollment Status
```bash
curl "http://localhost:3000/enrollments/check?student_id=user_123&course_id=course_1" \
  -H "Authorization: Bearer <token>"
```

## 🏗️ Development

### Project Structure
```
sbApi/
├── src/
│   └── index.ts          # Main application file
├── routes/
│   ├── auth.ts           # Authentication routes
│   ├── course.ts         # Course management routes
│   ├── user.ts           # User profile routes
│   └── enrollment.ts     # Enrollment routes
├── package.json
├── tsconfig.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server (after build)

### API Documentation

Visit `http://localhost:3000/api-docs` to access the interactive Swagger documentation where you can:
- View all available endpoints
- Test endpoints directly in the browser
- See request/response schemas
- Authenticate and maintain session

### Health Check

Monitor API health at `http://localhost:3000/health`

## 🔧 Configuration

### CORS Configuration
The API is configured to accept requests from `http://localhost:3001` by default. Update the `FRONTEND_URL` environment variable to match your frontend application.

### Error Handling
The API includes comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

### Request Logging
All requests are logged with timestamps for debugging and monitoring.

## 📈 Features for Frontend Integration

This API is specifically designed to work with the Scholarbase frontend application and provides:

- **Complete Authentication Flow**: Registration, login, logout, password reset
- **Course Browsing**: Filtering, searching, categorization, pagination
- **User Management**: Profile creation, updates, enrollment tracking
- **Enrollment System**: Course enrollment, unenrollment, status checking
- **Admin Features**: User statistics, search functionality

## 🚀 Production Deployment

For production deployment, ensure:

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up SSL/HTTPS
4. Configure database connections (replace mock data)
5. Set up proper logging and monitoring
6. Configure rate limiting and security middleware

---

**Ready to power your learning platform!** 🎓

For questions or support, check the API documentation at `/api-docs` or contact the development team.