import { Router } from "express";

const router = Router();

// Mock user/student data
const mockUsers = [
  {
    id: "user_123",
    email: "john.doe@example.com",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "user_456", 
    email: "jane.smith@example.com",
    created_at: "2024-01-15T00:00:00Z"
  }
];

const mockStudents = [
  {
    id: "user_123",
    First_name: "John",
    Last_name: "Doe",
    email: "john.doe@example.com",
    display_name: "John Doe",
    academic_level: "University",
    profile_picture: null,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "user_456",
    First_name: "Jane", 
    Last_name: "Smith",
    email: "jane.smith@example.com",
    display_name: "Jane Smith",
    academic_level: "Graduate",
    profile_picture: "/avatars/jane.jpg",
    created_at: "2024-01-15T00:00:00Z"
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         First_name:
 *           type: string
 *         Last_name:
 *           type: string
 *         email:
 *           type: string
 *         display_name:
 *           type: string
 *         academic_level:
 *           type: string
 *           enum: ["High School", "University", "Graduate", "Professional"]
 *         profile_picture:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     UserProfile:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *         student:
 *           $ref: '#/components/schemas/Student'
 */

/**
 * @swagger
 * /users/profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     description: Get complete user profile including student information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  
  const user = mockUsers.find(u => u.id === userId);
  const student = mockStudents.find(s => s.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({
    user,
    student: student || null
  });
});

/**
 * @swagger
 * /users/profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     description: Update user profile information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               First_name:
 *                 type: string
 *               Last_name:
 *                 type: string
 *               display_name:
 *                 type: string
 *               academic_level:
 *                 type: string
 *                 enum: ["High School", "University", "Graduate", "Professional"]
 *               profile_picture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
router.put("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  const { First_name, Last_name, display_name, academic_level, profile_picture } = req.body;
  
  const studentIndex = mockStudents.findIndex(s => s.id === userId);
  
  if (studentIndex === -1) {
    return res.status(404).json({ error: "User profile not found" });
  }
  
  // Update student profile
  const updatedStudent = {
    ...mockStudents[studentIndex],
    ...(First_name && { First_name }),
    ...(Last_name && { Last_name }),
    ...(display_name && { display_name }),
    ...(academic_level && { academic_level }),
    ...(profile_picture !== undefined && { profile_picture }),
    updated_at: new Date().toISOString()
  };
  
  mockStudents[studentIndex] = updatedStudent;
  
  res.json({
    student: updatedStudent,
    message: "Profile updated successfully"
  });
});

/**
 * @swagger
 * /users/{userId}/enrollments:
 *   get:
 *     summary: Get user enrollments
 *     description: Get all course enrollments for a user with course details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User enrollments with course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       enrollment_id:
 *                         type: string
 *                       course_id:
 *                         type: string
 *                       enrolled_at:
 *                         type: string
 *                         format: date-time
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           instructor:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *                           category:
 *                             type: string
 *                           level:
 *                             type: string
 *                           rating:
 *                             type: number
 *                           price:
 *                             type: number
 *                 total:
 *                   type: number
 *       404:
 *         description: User not found
 */
router.get("/:userId/enrollments", (req, res) => {
  const { userId } = req.params;
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  // Mock enrolled courses data
  const mockEnrollments = [
    {
      enrollment_id: "enrollment_1",
      course_id: "course_1",
      enrolled_at: "2024-01-15T10:00:00Z",
      course: {
        id: "course_1",
        title: "Introduction to Web Development",
        instructor: "Dr. Sarah Johnson",
        thumbnail: "/placeholder.jpg",
        category: "Programming",
        level: "Beginner",
        rating: 4.8,
        price: 99.99
      }
    },
    {
      enrollment_id: "enrollment_2",
      course_id: "course_2", 
      enrolled_at: "2024-02-01T14:30:00Z",
      course: {
        id: "course_2",
        title: "Advanced React Development",
        instructor: "Prof. Michael Chen",
        thumbnail: "/placeholder.jpg", 
        category: "Programming",
        level: "Advanced",
        rating: 4.9,
        price: 149.99
      }
    }
  ];
  
  res.json({
    enrollments: mockEnrollments,
    total: mockEnrollments.length
  });
});

/**
 * @swagger
 * /users/create-profile:
 *   post:
 *     summary: Create student profile
 *     description: Create a new student profile for an authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               id:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               displayName:
 *                 type: string
 *               academicLevel:
 *                 type: string
 *                 enum: ["High School", "University", "Graduate", "Professional"]
 *               profilePicture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error or profile already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/create-profile", (req, res) => {
  const { id, firstName, lastName, email, displayName, academicLevel, profilePicture } = req.body;
  
  if (!id || !firstName || !lastName || !email) {
    return res.status(400).json({ 
      error: "id, firstName, lastName, and email are required" 
    });
  }
  
  // Check if profile already exists
  const existingStudent = mockStudents.find(s => s.id === id);
  if (existingStudent) {
    return res.status(400).json({ error: "Student profile already exists" });
  }
  
  const newStudent = {
    id,
    First_name: firstName,
    Last_name: lastName,
    email,
    display_name: displayName || `${firstName} ${lastName}`,
    academic_level: academicLevel || null,
    profile_picture: profilePicture || null,
    created_at: new Date().toISOString()
  };
  
  mockStudents.push(newStudent);
  
  res.status(201).json({
    student: newStudent,
    message: "Student profile created successfully"
  });
});

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     description: Search for users by name or email (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserProfile'
 *                 total:
 *                   type: number
 *                 query:
 *                   type: string
 *       400:
 *         description: Missing search query
 *       403:
 *         description: Admin access required
 */
router.get("/search", (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  
  const searchLower = q.toString().toLowerCase();
  const searchResults = mockStudents.filter(student => 
    student.First_name.toLowerCase().includes(searchLower) ||
    student.Last_name.toLowerCase().includes(searchLower) ||
    student.email.toLowerCase().includes(searchLower) ||
    (student.display_name && student.display_name.toLowerCase().includes(searchLower))
  );
  
  const limitedResults = searchResults.slice(0, parseInt(limit.toString()));
  
  // Transform to include user data
  const userProfiles = limitedResults.map(student => {
    const user = mockUsers.find(u => u.id === student.id);
    return {
      user: user || { id: student.id, email: student.email },
      student
    };
  });
  
  res.json({
    users: userProfiles,
    total: searchResults.length,
    query: q
  });
});

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Get overall user statistics (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_users:
 *                   type: number
 *                 total_students:
 *                   type: number
 *                 academic_levels:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                 recent_signups:
 *                   type: number
 *       403:
 *         description: Admin access required
 */
router.get("/stats", (req, res) => {
  const totalUsers = mockUsers.length;
  const totalStudents = mockStudents.length;
  
  // Count by academic level
  const academicLevels = mockStudents.reduce((acc, student) => {
    const level = student.academic_level || 'Not Specified';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Mock recent signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSignups = mockUsers.filter(user => 
    new Date(user.created_at) > thirtyDaysAgo
  ).length;
  
  res.json({
    total_users: totalUsers,
    total_students: totalStudents,
    academic_levels: academicLevels,
    recent_signups: recentSignups
  });
});

export default router;
