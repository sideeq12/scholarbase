import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

// Import route modulessss
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import userRoutes from "./routes/user";
import enrollmentRoutes from "./routes/enrollment";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scholarbase API",
      version: "1.0.0",
      description: "Complete REST API for Scholarbase learning platform with authentication, courses, enrollments, and user management",
      contact: {
        name: "Scholarbase Team",
        email: "api@scholarbase.com"
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.scholarbase.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/*.ts"], // Include both routes and main file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Scholarbase API Documentation",
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/users", userRoutes);
app.use("/enrollments", enrollmentRoutes);

// Root endpoint with API information
app.get("/", (req, res) => {
  res.json({
    name: "Scholarbase API",
    version: "1.0.0",
    description: "REST API for Scholarbase learning platform",
    endpoints: {
      authentication: "/auth",
      courses: "/courses", 
      users: "/users",
      enrollments: "/enrollments",
      documentation: "/api-docs",
      health: "/health"
    },
    documentation_url: `http://localhost:${port}/api-docs`,
    status: "active"
  });
});

// Legacy hello endpoint for backward compatibility  
app.get("/hello", (req, res) => {
  res.json({ 
    message: "Hello from Scholarbase API!",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    available_routes: {
      auth: "/auth",
      courses: "/courses",
      users: "/users", 
      enrollments: "/enrollments",
      docs: "/api-docs"
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Scholarbase API server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`📊 Available endpoints:`);
  console.log(`   • Authentication: http://localhost:${port}/auth`);
  console.log(`   • Courses: http://localhost:${port}/courses`);
  console.log(`   • Users: http://localhost:${port}/users`);
  console.log(`   • Enrollments: http://localhost:${port}/enrollments`);
  console.log(`\n⚡ Ready to serve requests!`);
});
