import { Router } from "express";
const router = Router();

// Mock course data based on sB structure
const mockCourses = [
  {
    id: "course_1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript",
    instructor: "Dr. Sarah Johnson",
    author: "tutor_1",
    price: 99.99,
    original_price: 149.99,
    rating: 4.8,
    review_count: 156,
    student_count: 1250,
    thumbnail: "/placeholder.jpg",
    category: "Programming",
    level: "Beginner",
    featured: true,
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    duration_hours: 40,
    lesson_count: 25,
    tags: ["HTML", "CSS", "JavaScript", "Web Development"]
  },
  {
    id: "course_2", 
    title: "Advanced React Development",
    description: "Master React with hooks, context, and advanced patterns",
    instructor: "Prof. Michael Chen",
    author: "tutor_2",
    price: 149.99,
    original_price: 199.99,
    rating: 4.9,
    review_count: 89,
    student_count: 890,
    thumbnail: "/placeholder.jpg",
    category: "Programming",
    level: "Advanced",
    featured: true,
    is_published: true,
    created_at: "2024-02-01T00:00:00Z",
    duration_hours: 60,
    lesson_count: 35,
    tags: ["React", "JavaScript", "Frontend", "Hooks"]
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         instructor:
 *           type: string
 *         author:
 *           type: string
 *         price:
 *           type: number
 *         original_price:
 *           type: number
 *         rating:
 *           type: number
 *         review_count:
 *           type: number
 *         student_count:
 *           type: number
 *         thumbnail:
 *           type: string
 *         category:
 *           type: string
 *         level:
 *           type: string
 *           enum: ["Beginner", "Intermediate", "Advanced"]
 *         featured:
 *           type: boolean
 *         is_published:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         duration_hours:
 *           type: number
 *         lesson_count:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     description: Fetch all published courses with optional filtering and pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for course title, instructor, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by course category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: ["Beginner", "Intermediate", "Advanced"]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured courses
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ["popular", "rating", "newest", "price-low", "price-high"]
 *         description: Sort courses by criteria
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Number of courses to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of courses to skip
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 */
router.get("/", (req, res) => {
  const { search, category, level, featured, priceMin, priceMax, sortBy, limit = 20, offset = 0 } = req.query;
  
  let filteredCourses = [...mockCourses];
  
  // Apply filters
  if (search) {
    const searchLower = search.toString().toLowerCase();
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (category) {
    filteredCourses = filteredCourses.filter(course => course.category === category);
  }
  
  if (level) {
    filteredCourses = filteredCourses.filter(course => course.level === level);
  }
  
  if (featured !== undefined) {
    filteredCourses = filteredCourses.filter(course => course.featured === (featured === 'true'));
  }
  
  if (priceMin) {
    filteredCourses = filteredCourses.filter(course => course.price >= parseFloat(priceMin.toString()));
  }
  
  if (priceMax) {
    filteredCourses = filteredCourses.filter(course => course.price <= parseFloat(priceMax.toString()));
  }
  
  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredCourses.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredCourses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
      default:
        filteredCourses.sort((a, b) => b.student_count - a.student_count);
        break;
    }
  }
  
  // Apply pagination
  const startIndex = parseInt(offset.toString());
  const limitNum = parseInt(limit.toString());
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + limitNum);
  
  res.json({
    courses: paginatedCourses,
    total: filteredCourses.length,
    page: Math.floor(startIndex / limitNum) + 1,
    limit: limitNum
  });
});

/**
 * @swagger
 * /courses/featured:
 *   get:
 *     summary: Get featured courses
 *     description: Get a list of featured courses
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 8
 *         description: Number of featured courses to return
 *     responses:
 *       200:
 *         description: List of featured courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
router.get("/featured", (req, res) => {
  const { limit = 8 } = req.query;
  const featuredCourses = mockCourses
    .filter(course => course.featured)
    .slice(0, parseInt(limit.toString()));
  
  res.json({ courses: featuredCourses });
});

/**
 * @swagger
 * /courses/categories:
 *   get:
 *     summary: Get all course categories
 *     description: Get a list of all available course categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/categories", (req, res) => {
  const categories = [...new Set(mockCourses.map(course => course.category))];
  res.json({ categories });
});

/**
 * @swagger
 * /courses/category/{category}:
 *   get:
 *     summary: Get courses by category
 *     description: Get all courses in a specific category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Course category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of courses to return
 *     responses:
 *       200:
 *         description: List of courses in category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 category:
 *                   type: string
 *                 total:
 *                   type: number
 *       404:
 *         description: Category not found
 */
router.get("/category/:category", (req, res) => {
  const { category } = req.params;
  const { limit } = req.query;
  
  const categoryExists = mockCourses.some(course => course.category === category);
  if (!categoryExists) {
    return res.status(404).json({ error: "Category not found" });
  }
  
  let coursesByCategory = mockCourses.filter(course => course.category === category);
  
  if (limit) {
    coursesByCategory = coursesByCategory.slice(0, parseInt(limit.toString()));
  }
  
  res.json({
    courses: coursesByCategory,
    category,
    total: coursesByCategory.length
  });
});

/**
 * @swagger
 * /courses/search:
 *   get:
 *     summary: Search courses
 *     description: Search for courses by title, instructor, or description
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
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 query:
 *                   type: string
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *       400:
 *         description: Missing search query
 */
router.get("/search", (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  
  const searchLower = q.toString().toLowerCase();
  const searchResults = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchLower) ||
    course.instructor.toLowerCase().includes(searchLower) ||
    course.description.toLowerCase().includes(searchLower) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
  
  // Apply pagination
  const startIndex = parseInt(offset.toString());
  const limitNum = parseInt(limit.toString());
  const paginatedResults = searchResults.slice(startIndex, startIndex + limitNum);
  
  res.json({
    courses: paginatedResults,
    query: q,
    total: searchResults.length,
    page: Math.floor(startIndex / limitNum) + 1
  });
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Get detailed information about a specific course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const course = mockCourses.find(course => course.id === id);
  
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  
  res.json(course);
});

/**
 * @swagger
 * /courses/{id}/similar:
 *   get:
 *     summary: Get similar courses
 *     description: Get courses similar to the specified course based on category and level
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 4
 *         description: Number of similar courses to return
 *     responses:
 *       200:
 *         description: List of similar courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get("/:id/similar", (req, res) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;
  
  const course = mockCourses.find(course => course.id === id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  
  const similarCourses = mockCourses
    .filter(c => c.id !== id && (c.category === course.category || c.level === course.level))
    .slice(0, parseInt(limit.toString()));
  
  res.json({ courses: similarCourses });
});

export default router;
