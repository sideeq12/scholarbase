import { Router } from "express";

const router = Router();

// Mock enrollment data
const mockEnrollments = [
  {
    id: "enrollment_1",
    created_at: "2024-01-15T10:00:00Z",
    student_id: "user_123",
    course_id: "course_1",
    tutor_id: "tutor_1"
  },
  {
    id: "enrollment_2", 
    created_at: "2024-01-20T15:30:00Z",
    student_id: "user_456",
    course_id: "course_2",
    tutor_id: "tutor_2"
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         student_id:
 *           type: string
 *         course_id:
 *           type: string
 *         tutor_id:
 *           type: string
 *     EnrollmentRequest:
 *       type: object
 *       required:
 *         - student_id
 *         - course_id
 *       properties:
 *         student_id:
 *           type: string
 *         course_id:
 *           type: string
 *         tutor_id:
 *           type: string
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create new enrollment
 *     description: Enroll a student in a course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentRequest'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollment:
 *                   $ref: '#/components/schemas/Enrollment'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - missing required fields
 *       409:
 *         description: Already enrolled in this course
 */
router.post("/", (req, res) => {
  const { student_id, course_id, tutor_id } = req.body;
  
  if (!student_id || !course_id) {
    return res.status(400).json({ 
      error: "student_id and course_id are required" 
    });
  }
  
  // Check if already enrolled
  const existingEnrollment = mockEnrollments.find(
    e => e.student_id === student_id && e.course_id === course_id
  );
  
  if (existingEnrollment) {
    return res.status(409).json({ 
      error: "Student is already enrolled in this course" 
    });
  }
  
  const newEnrollment = {
    id: `enrollment_${Date.now()}`,
    created_at: new Date().toISOString(),
    student_id,
    course_id,
    tutor_id: tutor_id || null
  };
  
  mockEnrollments.push(newEnrollment);
  
  res.status(201).json({
    enrollment: newEnrollment,
    message: "Enrollment created successfully"
  });
});

/**
 * @swagger
 * /enrollments/student/{studentId}:
 *   get:
 *     summary: Get student enrollments
 *     description: Get all enrollments for a specific student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: include_courses
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include course details in response
 *     responses:
 *       200:
 *         description: List of student enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 *                 student_id:
 *                   type: string
 *                 total:
 *                   type: number
 *       404:
 *         description: Student not found
 */
router.get("/student/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { include_courses } = req.query;
  
  const studentEnrollments = mockEnrollments.filter(
    e => e.student_id === studentId
  );
  
  let responseEnrollments = studentEnrollments;
  
  // Mock course details if requested
  if (include_courses === 'true') {
    responseEnrollments = studentEnrollments.map(enrollment => ({
      ...enrollment,
      course: {
        id: enrollment.course_id,
        title: enrollment.course_id === 'course_1' ? 'Introduction to Web Development' : 'Advanced React Development',
        thumbnail: '/placeholder.jpg',
        instructor: enrollment.course_id === 'course_1' ? 'Dr. Sarah Johnson' : 'Prof. Michael Chen',
        category: 'Programming',
        level: enrollment.course_id === 'course_1' ? 'Beginner' : 'Advanced'
      }
    }));
  }
  
  res.json({
    enrollments: responseEnrollments,
    student_id: studentId,
    total: studentEnrollments.length
  });
});

/**
 * @swagger
 * /enrollments/course/{courseId}:
 *   get:
 *     summary: Get course enrollments
 *     description: Get all enrollments for a specific course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: include_students
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include student details in response
 *     responses:
 *       200:
 *         description: List of course enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 *                 course_id:
 *                   type: string
 *                 total:
 *                   type: number
 *       404:
 *         description: Course not found
 */
router.get("/course/:courseId", (req, res) => {
  const { courseId } = req.params;
  const { include_students } = req.query;
  
  const courseEnrollments = mockEnrollments.filter(
    e => e.course_id === courseId
  );
  
  let responseEnrollments = courseEnrollments;
  
  // Mock student details if requested
  if (include_students === 'true') {
    responseEnrollments = courseEnrollments.map(enrollment => ({
      ...enrollment,
      student: {
        id: enrollment.student_id,
        First_name: 'John',
        Last_name: 'Doe',
        email: `student${enrollment.student_id.slice(-3)}@example.com`,
        display_name: 'John Doe'
      }
    }));
  }
  
  res.json({
    enrollments: responseEnrollments,
    course_id: courseId,
    total: courseEnrollments.length
  });
});

/**
 * @swagger
 * /enrollments/check:
 *   get:
 *     summary: Check enrollment status
 *     description: Check if a student is enrolled in a specific course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_enrolled:
 *                   type: boolean
 *                 enrollment:
 *                   $ref: '#/components/schemas/Enrollment'
 *                 student_id:
 *                   type: string
 *                 course_id:
 *                   type: string
 *       400:
 *         description: Missing required parameters
 */
router.get("/check", (req, res) => {
  const { student_id, course_id } = req.query;
  
  if (!student_id || !course_id) {
    return res.status(400).json({
      error: "student_id and course_id are required"
    });
  }
  
  const enrollment = mockEnrollments.find(
    e => e.student_id === student_id && e.course_id === course_id
  );
  
  res.json({
    is_enrolled: !!enrollment,
    enrollment: enrollment || null,
    student_id,
    course_id
  });
});

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   get:
 *     summary: Get enrollment details
 *     description: Get detailed information about a specific enrollment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollment:
 *                   $ref: '#/components/schemas/Enrollment'
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     First_name:
 *                       type: string
 *                     Last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 course:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     instructor:
 *                       type: string
 *       404:
 *         description: Enrollment not found
 */
router.get("/:enrollmentId", (req, res) => {
  const { enrollmentId } = req.params;
  
  const enrollment = mockEnrollments.find(e => e.id === enrollmentId);
  
  if (!enrollment) {
    return res.status(404).json({ error: "Enrollment not found" });
  }
  
  // Mock related data
  const mockStudent = {
    id: enrollment.student_id,
    First_name: "John",
    Last_name: "Doe", 
    email: `student${enrollment.student_id.slice(-3)}@example.com`
  };
  
  const mockCourse = {
    id: enrollment.course_id,
    title: enrollment.course_id === 'course_1' ? 'Introduction to Web Development' : 'Advanced React Development',
    instructor: enrollment.course_id === 'course_1' ? 'Dr. Sarah Johnson' : 'Prof. Michael Chen'
  };
  
  res.json({
    enrollment,
    student: mockStudent,
    course: mockCourse
  });
});

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   delete:
 *     summary: Remove enrollment
 *     description: Unenroll a student from a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 enrollment_id:
 *                   type: string
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:enrollmentId", (req, res) => {
  const { enrollmentId } = req.params;
  
  const enrollmentIndex = mockEnrollments.findIndex(e => e.id === enrollmentId);
  
  if (enrollmentIndex === -1) {
    return res.status(404).json({ error: "Enrollment not found" });
  }
  
  mockEnrollments.splice(enrollmentIndex, 1);
  
  res.json({
    message: "Enrollment removed successfully",
    enrollment_id: enrollmentId
  });
});

/**
 * @swagger
 * /enrollments/student/{studentId}/unenroll:
 *   post:
 *     summary: Unenroll from course
 *     description: Remove student enrollment from a specific course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *             properties:
 *               course_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unenrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student_id:
 *                   type: string
 *                 course_id:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Enrollment not found
 */
router.post("/student/:studentId/unenroll", (req, res) => {
  const { studentId } = req.params;
  const { course_id } = req.body;
  
  if (!course_id) {
    return res.status(400).json({ error: "course_id is required" });
  }
  
  const enrollmentIndex = mockEnrollments.findIndex(
    e => e.student_id === studentId && e.course_id === course_id
  );
  
  if (enrollmentIndex === -1) {
    return res.status(404).json({ 
      error: "Enrollment not found for this student and course" 
    });
  }
  
  mockEnrollments.splice(enrollmentIndex, 1);
  
  res.json({
    message: "Unenrolled successfully",
    student_id: studentId,
    course_id
  });
});

/**
 * @swagger
 * /enrollments/course/{courseId}/count:
 *   get:
 *     summary: Get enrollment count
 *     description: Get the total number of enrollments for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course_id:
 *                   type: string
 *                 enrollment_count:
 *                   type: number
 */
router.get("/course/:courseId/count", (req, res) => {
  const { courseId } = req.params;
  
  const count = mockEnrollments.filter(e => e.course_id === courseId).length;
  
  res.json({
    course_id: courseId,
    enrollment_count: count
  });
});

/**
 * @swagger
 * /enrollments/stats:
 *   get:
 *     summary: Get enrollment statistics
 *     description: Get overall enrollment statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollment statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_enrollments:
 *                   type: number
 *                 unique_students:
 *                   type: number
 *                 unique_courses:
 *                   type: number
 *                 recent_enrollments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 */
router.get("/stats", (req, res) => {
  const totalEnrollments = mockEnrollments.length;
  const uniqueStudents = new Set(mockEnrollments.map(e => e.student_id)).size;
  const uniqueCourses = new Set(mockEnrollments.map(e => e.course_id)).size;
  
  // Get recent enrollments (last 10)
  const recentEnrollments = mockEnrollments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
  
  res.json({
    total_enrollments: totalEnrollments,
    unique_students: uniqueStudents,
    unique_courses: uniqueCourses,
    recent_enrollments: recentEnrollments
  });
});

export default router;