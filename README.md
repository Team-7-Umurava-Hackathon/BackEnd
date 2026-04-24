# AI Recruiter Backend

Backend API for AI-powered recruitment platform built with Node.js and Express.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (file uploads)
- JWT Authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/ai-recruiter
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

3. Run the server:
```bash
npm start        # Production
npm run dev      # Development with nodemon
```

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/*` - Authentication routes
- `GET/POST /api/user/*` - User management
- `GET/POST /api/jobs/*` - Job postings
- `GET/POST /api/talents/*` - Talent profiles
- `GET/POST /api/ranking/*` - Ranking system

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
└── routes/         # API routes
```
