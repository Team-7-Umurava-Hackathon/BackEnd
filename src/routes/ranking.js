import express from "express";
import {
  scoreCandidates,
  getJobRankings,
  getTopCandidates,
  getRanking
} from "../controllers/ranking.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Score and rank all candidates for a job
 * POST /api/rankings/score-candidates
 * 
 * Body: {
 *   jobId: "65c7a9e2b5f4e2c8a9d7e1f2",
 *   topN: 10
 * }
 */
router.post("/score-candidates", verifyToken, scoreCandidates);

/**
 * Get all rankings for a job (sorted by rank)
 * GET /api/rankings/job/:jobId
 */
router.get("/job/:jobId", verifyToken, getJobRankings);

/**
 * Get top N candidates for a job
 * GET /api/rankings/job/:jobId/top/:n
 */
router.get("/job/:jobId/top/:n", verifyToken, getTopCandidates);

/**
 * Get single ranking details
 * GET /api/rankings/:rankingId
 */
router.get("/:rankingId", verifyToken, getRanking);

export default router;