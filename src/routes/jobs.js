import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobs.js";

const router = express.Router();

/**
 * CREATE JOB
 * POST /api/jobs
 */
router.post("/", createJob);

/**
 * GET ALL JOBS
 * GET /api/jobs
 */
router.get("/", getJobs);

/**
 * GET SINGLE JOB
 * GET /api/jobs/:id
 */
router.get("/:id", getJobById);

/**
 * UPDATE JOB
 * PUT /api/jobs/:id
 */
router.put("/:id", updateJob);

/**
 * DELETE JOB
 * DELETE /api/jobs/:id
 */
router.delete("/:id", deleteJob);

export default router;