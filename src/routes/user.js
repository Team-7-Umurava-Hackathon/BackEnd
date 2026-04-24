import express from "express";
import { registerRecruiter } from "../controllers/user.js";

const router = express.Router();

// Register recruiter
router.post("/register", registerRecruiter);


export default router;