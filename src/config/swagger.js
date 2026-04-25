/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Talent or Employer)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [talent, employer, admin]
 *                 example: talent
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid input or user already exists
 *
 * /auth/login:
 *   post:
 *     summary: Login a user and receive JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@company.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *
 * /jobs:
 *   get:
 *     summary: Get all job postings
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of jobs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by job title or description
 *     responses:
 *       200:
 *         description: List of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *
 *   post:
 *     summary: Create a new job posting (Employer only)
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Software Engineer
 *               description:
 *                 type: string
 *                 example: We are looking for an experienced software engineer...
 *               location:
 *                 type: string
 *                 example: Kigali, Rwanda
 *               salary:
 *                 type: string
 *                 example: $50,000 - $80,000
 *               jobType:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Remote]
 *                 example: Full-time
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Node.js", "React", "MongoDB"]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Backend Development", "System Design"]
 *               experienceLevel:
 *                 type: string
 *                 enum: [Entry, Intermediate, Senior]
 *                 example: Senior
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *
 *   put:
 *     summary: Update a job by ID (Employer only)
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: string
 *               jobType:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *
 *   delete:
 *     summary: Delete a job by ID (Employer only)
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *
 * /talents/{id}/apply:
 *   post:
 *     summary: Apply for a job with detailed form data
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               location:
 *                 type: string
 *                 example: Kigali, Rwanda
 *               headline:
 *                 type: string
 *                 example: Senior Software Engineer
 *               bio:
 *                 type: string
 *                 example: Experienced developer with 10 years in the field
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [Beginner, Intermediate, Advanced, Expert]
 *                     yearsOfExperience:
 *                       type: number
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     proficiency:
 *                       type: string
 *                       enum: [Basic, Intermediate, Fluent, Native]
 *               experiences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     company:
 *                       type: string
 *                     role:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     technologies:
 *                       type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     fieldOfStudy:
 *                       type: string
 *                     startYear:
 *                       type: string
 *                     endYear:
 *                       type: string
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuer:
 *                       type: string
 *                     issueDate:
 *                       type: string
 *                       format: date
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     link:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     technologies:
 *                       type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 applicationId:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Already applied for this job
 *
 * /talents/upload/pdf:
 *   post:
 *     summary: Upload resume as PDF (requires authentication)
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: File type (pdf)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - jobId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF resume file
 *               jobId:
 *                 type: string
 *                 description: Job ID to apply for
 *     responses:
 *       200:
 *         description: Resume uploaded and application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 applicationId:
 *                   type: string
 *                 resumeUrl:
 *                   type: string
 *       400:
 *         description: Invalid file or missing jobId
 *       401:
 *         description: Unauthorized - login required
 *       413:
 *         description: File too large
 *
 * /applications:
 *   get:
 *     summary: Get all applications (Employer) or user's applications (Talent)
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter applications by job ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, accepted, rejected]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *
 * /applications/{id}:
 *   get:
 *     summary: Get application details by ID
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *
 *   put:
 *     summary: Update application status (Employer only)
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewing, accepted, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *
 *   delete:
 *     summary: Delete/Withdraw application
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Application deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *
 * /rankings/score-candidates:
 *   post:
 *     summary: Score and rank all candidates for a job (Employer only)
 *     tags:
 *       - Rankings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: 65c7a9e2b5f4e2c8a9d7e1f2
 *                 description: The job ID to score candidates for
 *               topN:
 *                 type: integer
 *                 example: 10
 *                 description: Number of top candidates to return (optional)
 *     responses:
 *       200:
 *         description: Candidates scored and ranked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                 totalCandidates:
 *                   type: integer
 *                 rankings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ranking'
 *       400:
 *         description: Invalid jobId or no candidates found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *
 * /rankings/job/{jobId}:
 *   get:
 *     summary: Get all rankings for a job (sorted by rank)
 *     tags:
 *       - Rankings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of rankings per page
 *     responses:
 *       200:
 *         description: List of rankings for the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                 totalRankings:
 *                   type: integer
 *                 rankings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ranking'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *
 * /rankings/job/{jobId}/top/{n}:
 *   get:
 *     summary: Get top N candidates for a job
 *     tags:
 *       - Rankings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of top candidates to return
 *     responses:
 *       200:
 *         description: Top N candidates for the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                 topN:
 *                   type: integer
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ranking'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *
 * /rankings/{rankingId}:
 *   get:
 *     summary: Get single ranking details
 *     tags:
 *       - Rankings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rankingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ranking ID
 *     responses:
 *       200:
 *         description: Ranking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ranking'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ranking not found
 *
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         salary:
 *           type: string
 *         jobType:
 *           type: string
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         experienceLevel:
 *           type: string
 *         postedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         job:
 *           type: string
 *         applicantName:
 *           type: string
 *         applicantEmail:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, reviewing, accepted, rejected]
 *         resumeUrl:
 *           type: string
 *         applicantData:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Ranking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         job:
 *           type: string
 *           description: Job ID
 *         application:
 *           type: string
 *           description: Application ID
 *         candidate:
 *           type: object
 *           description: Candidate information
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             headline:
 *               type: string
 *             location:
 *               type: string
 *         score:
 *           type: number
 *           format: float
 *           description: Overall candidate score (0-100)
 *           example: 87.5
 *         rank:
 *           type: integer
 *           description: Ranking position (1 being the best)
 *           example: 1
 *         scoreBreakdown:
 *           type: object
 *           description: Detailed score breakdown
 *           properties:
 *             skillsMatch:
 *               type: number
 *               format: float
 *               description: Skills matching score
 *             experienceMatch:
 *               type: number
 *               format: float
 *               description: Experience level matching score
 *             educationMatch:
 *               type: number
 *               format: float
 *               description: Education matching score
 *             certificationMatch:
 *               type: number
 *               format: float
 *               description: Certifications matching score
 *         reasoning:
 *           type: string
 *           description: AI-generated explanation of the ranking
 *           example: "Strong match with 8/10 required skills, 12+ years experience in similar roles"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Recruiter API",
      version: "1.0.0",
      description: "API documentation for AI Recruiter backend",
      contact: {
        name: "Support",
        email: "support@airecruiter.com"
      }
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:5000/api",
        description: process.env.NODE_ENV === "production" ? "Production Server" : "Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT authorization header using the Bearer scheme"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 👇 Point to this SAME file for JSDoc comments
  apis: ["./src/config/swagger.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: false
    }
  }));
  console.log("✅ Swagger docs available at /api/docs");
};