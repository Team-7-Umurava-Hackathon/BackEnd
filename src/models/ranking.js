import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  // Link to job
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  // Link to talent
  talentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Talent",
    required: true
  },

  // Ranking info
  rank: {
    type: Number,
    required: true // e.g. 1 → 10
  },

  matchScore: {
    type: Number,
    required: true, // e.g. 94
    min: 0,
    max: 100
  },

  // Snapshot (so UI doesn't always populate)
  snapshot: {
    name: String, // "Alice Mutoni"
    headline: String // "Frontend Developer with 3 years experience"
  },

  // AI Evaluation
  strengths: [
    {
      type: String
    }
  ],

  gaps: [
    {
      type: String
    }
  ],

  finalRecommendation: {
    type: String
  },

  // Optional: categorize recommendation (useful later)
  recommendationLevel: {
    type: String,
    enum: ["Highly Recommended", "Recommended", "Consider", "Not Recommended"]
  }

}, { timestamps: true });

// Index for faster queries
rankingSchema.index({ jobId: 1, rank: 1 });
rankingSchema.index({ talentId: 1 });


export default mongoose.model("Ranking", rankingSchema);
