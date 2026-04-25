import express from "express";
import {
  createTalent,
  getTalents,
  getTalentById,
  deleteTalent,
  getTalentsByJob,
  uploadCVPDF,
  uploadExcel
} from "../controllers/talents.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * APPLY TO JOB
 * POST /api/talents/:jobId/apply
 */
router.post("/:jobId/apply", createTalent);

/**
 * GET ALL TALENTS
 * (optional filter: ?job=JOB_ID)
 * GET /api/talents
 */
router.get("/",verifyToken, getTalents);

/**
 * GET TALENTS FOR A SPECIFIC JOB
 * GET /api/talents/job/:jobId
 */
router.get("/job/:jobId",verifyToken, getTalentsByJob);

/**
 * GET SINGLE TALENT
 * GET /api/talents/:id
 */
router.get("/:id", verifyToken, getTalentById);

/**
 * DELETE TALENT
 * DELETE /api/talents/:id
 */
router.delete("/:id", verifyToken, deleteTalent);


// =====================
// FILE UPLOAD ROUTES 🔥
// =====================

/**
 * Upload CV (PDF)
 * POST /api/talents/upload/pdf
 */
router.post("/upload/pdf", verifyToken, upload.single("file"), uploadCVPDF);

/**
 * Upload spreadsheet
 * POST /api/talents/upload/csv
 */
router.post(
  "/upload/excel",
  verifyToken,
  upload.single("file"),
  uploadExcel
);

export default router;