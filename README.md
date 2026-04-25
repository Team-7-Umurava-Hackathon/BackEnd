# AI Recruiter Backend

Backend API for AI-powered recruitment platform built with Node.js and Express. This platform leverages AI to intelligently match candidates with job opportunities based on skills, experience, and qualifications.

## 🌟 Features

- **User Authentication** - JWT-based secure authentication for talents and employers
- **Job Management** - Create, read, update, and delete job postings
- **Talent Profiles** - Comprehensive talent management with detailed profiles
- **AI-Powered Ranking** - Intelligent candidate scoring and ranking system
- **Resume Upload** - Support for PDF resume uploads with authentication
- **Application Management** - Track and manage job applications with status updates

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **File Storage**: Cloudinary (for resume uploads)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI 3.0
- **Development**: Nodemon

## 📋 Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-recruiter-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in the root directory:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-recruiter
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-recruiter

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API URL (for documentation)
API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Run the server:**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Complete API documentation is available at:

**👉 [https://backend-3ynt.onrender.com/api/docs/](https://backend-3ynt.onrender.com/api/docs/)**

The documentation includes:
- ✅ **Interactive API Explorer** - Test endpoints directly from the browser
- ✅ **Authentication Setup** - Instructions for JWT token usage
- ✅ **Request/Response Examples** - Real examples for each endpoint
- ✅ **Data Schemas** - Detailed information about Job, Application, and Ranking schemas
- ✅ **Error Responses** - Complete error documentation

### Quick API Overview

#### **Authentication**
- `POST /api/auth/register` - Register new user (talent or employer)
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout user

#### **Jobs**
- `GET /api/jobs` - Get all job postings (with pagination & search)
- `POST /api/jobs` - Create new job (employer only)
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job (employer only)
- `DELETE /api/jobs/{id}` - Delete job (employer only)

#### **Applications**
- `POST /api/talents/{jobId}/apply` - Apply for job with form data
- `POST /api/talents/upload/pdf` - Upload resume as PDF (requires authentication)
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}` - Update application status
- `DELETE /api/applications/{id}` - Withdraw application

#### **Rankings** (AI-Powered)
- `POST /api/rankings/score-candidates` - Score and rank candidates for a job
- `GET /api/rankings/job/{jobId}` - Get all rankings for a job
- `GET /api/rankings/job/{jobId}/top/{n}` - Get top N candidates
- `GET /api/rankings/{rankingId}` - Get ranking details

#### **Users**
- `GET /api/users/me` - Get current user profile (requires authentication)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting Started with Authentication:

1. **Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "talent"
  }'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

3. **Use token for protected endpoints:**
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   └── swagger.js       # API documentation (Swagger/OpenAPI)
│
├── controllers/         # Request handlers
│   ├── auth.js          # Authentication logic
│   ├── jobs.js          # Job management
│   ├── applications.js  # Application handling
│   ├── ranking.js       # AI ranking system
│   └── users.js         # User management
│
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT verification
│   └── upload.js        # File upload handling
│
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Job.js
│   ├── Application.js
│   └── Ranking.js
│
├── routes/              # API route definitions
│   ├── auth.js
│   ├── jobs.js
│   ├── applications.js
│   ├── ranking.js
│   └── users.js
│
├── uploads/             # Temporary file storage
│
├── index.js             # Server entry point
└── .env                 # Environment variables (not in git)
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
API_URL=https://your-api-domain.com/api
PORT=5000
JWT_SECRET=your_production_secret_key
MONGODB_URI=your_production_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Deploying to Render

1. Push your code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Add environment variables in Render dashboard
5. Deploy

Your API will be available at: `https://your-app-name.onrender.com`

## 🧪 Testing

### Using Swagger UI (Recommended)
Visit the interactive API docs at `/api/docs` to test endpoints directly

### Using cURL

```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Create a job (requires auth)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "description": "Looking for experienced developer",
    "location": "Remote",
    "salary": "$80,000 - $120,000",
    "jobType": "Full-time"
  }'
```

### Using Postman

1. Import the Swagger spec: `https://backend-3ynt.onrender.com/api/docs/`
2. Set up environment variables with your JWT token
3. Start testing endpoints

## 📊 Key Models

### User
- Role: talent | employer | admin
- Email, name, password (hashed)
- Timestamps

### Job
- Title, description, location
- Salary, job type, experience level
- Requirements, skills
- Posted by employer
- Timestamps

### Application
- Job reference
- Applicant information
- Status: pending | reviewing | accepted | rejected
- Resume URL
- Timestamps

### Ranking
- Job and application references
- AI-generated score (0-100)
- Rank position
- Score breakdown (skills, experience, education, certifications)
- AI reasoning explanation
- Timestamps

## 🐛 Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network access if using MongoDB Atlas

### Authentication Errors
- Token expired: Re-login to get a new token
- Invalid token: Check token format in Authorization header
- Missing token: Add `Authorization: Bearer YOUR_TOKEN` header

### File Upload Issues
- Check Cloudinary credentials
- Verify file size limits
- Ensure PDF format for resume uploads

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/ai-recruiter` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` \| `production` |
| `JWT_SECRET` | Token secret | `your_secret_key` |
| `API_URL` | API base URL | `http://localhost:5000/api` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | `your_api_secret` |

## 📖 Documentation

Full API documentation with examples: **[https://backend-3ynt.onrender.com/api/docs/](https://backend-3ynt.onrender.com/api/docs/)**

## 🔗 Related Projects

- **Frontend**: React-based user interface
- **Database**: MongoDB hosted on Atlas or local instance

## 💡 Tips

- **Testing Protected Endpoints**: Use the Swagger UI "Authorize" button to add your JWT token
- **Pagination**: Add `page` and `limit` query parameters to list endpoints
- **Filtering**: Use query parameters to filter results (e.g., `status=accepted`)
- **Error Details**: Check the response body for detailed error messages




**Backend Status**: ✅ Active - https://backend-3ynt.onrender.com
