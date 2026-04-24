import axios from "axios";
import Talent from "../models/talent.js";
import Ranking from "../models/ranking.js";
import Job from "../models/job.js"; 

/**
 * Rank candidates for a job
 * POST /api/rankings/score-candidates
 * Body: { jobId: "...", topN: 10 }
 */
export const scoreCandidates = async (req, res) => {
  try {
    req.setTimeout(600000);

    const { jobId, topN = 10 } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    console.log(`📊 Ranking candidates for job: ${jobId}`);
    console.log(`   Top N: ${topN}`);

    // Step 1: Fetch job details
    console.log("📋 Fetching job details...");
    const job = await fetchJobDetails(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Step 2: Fetch all talents for this job
    console.log("👥 Fetching talents for this job...");
    const talents = await Talent.find({ job: jobId }).lean();

    if (!talents || talents.length === 0) {
      return res.status(404).json({ error: "No talents found for this job" });
    }

    console.log(`   Found ${talents.length} talents`);

    // ✅ STEP 2.5: DELETE OLD RANKINGS BEFORE SAVING NEW ONES
    console.log("🧹 Deleting previous rankings...");
    await Ranking.deleteMany({ jobId });

    // Step 3: Prepare data for AI API
    console.log("🔄 Preparing data for scoring...");
    const payload = preparePayloadForAI(talents, job, topN);

    // Step 4: Call AI API
    console.log(`📤 Calling AI API: /score/grade/batch...`);
    const aiResponse = await callAIRankingAPI(payload);

    // Step 5: Save rankings to database
    console.log("💾 Saving new rankings to database...");
    const savedRankings = await saveRankingsToDatabase(
      jobId,
      aiResponse.grades,
      talents
    );

    console.log(`✅ Ranked ${savedRankings.length} candidates`);

    return res.status(200).json({
      success: true,
      jobId,
      talentsEvaluated: talents.length,
      rankingsSaved: savedRankings.length,
      topRanking: savedRankings[0] || null,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get rankings for a job
 * GET /api/rankings/job/:jobId
 */
export const getJobRankings = async (req, res) => {
  try {
    const { jobId } = req.params;

    const rankings = await Ranking.find({ jobId })
      .populate("talentId", "firstName lastName email headline")
      .populate("jobId", "title")
      .sort({ rank: 1 });

    res.json({
      success: true,
      jobId,
      count: rankings.length,
      rankings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get top candidates for a job
 * GET /api/rankings/job/:jobId/top/:n
 */
export const getTopCandidates = async (req, res) => {
  try {
    const { jobId, n = 5 } = req.params;

    const rankings = await Ranking.find({ jobId })
      .populate("talentId", "firstName lastName email headline location skills")
      .populate("jobId", "title")
      .sort({ rank: 1 })
      .limit(parseInt(n));

    res.json({
      success: true,
      jobId,
      topN: n,
      count: rankings.length,
      candidates: rankings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get single ranking
 * GET /api/rankings/:rankingId
 */
export const getRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findById(req.params.rankingId)
      .populate("talentId")
      .populate("jobId");

    if (!ranking) {
      return res.status(404).json({ error: "Ranking not found" });
    }

    res.json({ success: true, ranking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Fetch job details (implement based on your Job model)
 */
async function fetchJobDetails(jobId) {
  try {
    const job = await Job.findById(jobId);
    
    if (!job) {
      throw new Error(`Job not found with ID: ${jobId}`);
    }
 
    return {
      _id: job._id,
      title: job.title,
      skills: job.skills || []
    };
  } catch (error) {
    console.error("Error fetching job:", error.message);
    return null;
  }
}

/**
 * Prepare payload for AI ranking API
 */
function preparePayloadForAI(talents, job, topN) {
  return {
    candidates: talents.map(talent => ({
      id: talent._id.toString(),
      firstName: talent.firstName,
      lastName: talent.lastName,
      email: talent.email,
      headline: talent.headline,
      bio: talent.bio,
      location: talent.location,
      skills: talent.skills,
      languages: talent.languages,
      experience: talent.experience,
      education: talent.education,
      availability: talent.availability
    })),
    job: {
      title: job.title,
      skills: job.skills
    },
    topN: topN
  };
}

/**
 * Call AI ranking API
 */
async function callAIRankingAPI(payload) {
  const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const endpoint = `${aiUrl}/score/grade/batch?provider=groq`;

  try {
    const response = await axios.post(endpoint, payload, {
      timeout: 300000 // 5 minutes
    });
    return response.data;
  } catch (error) {
    console.error("AI API Error:", error.message);
    throw new Error(`AI ranking API error: ${error.message}`);
  }
}

/**
 * Save rankings to database
 */
async function saveRankingsToDatabase(jobId, grades, talents) {
  const savedRankings = [];

  // Create a map of talent IDs to names for quick lookup
  const talentMap = new Map();
  talents.forEach(talent => {
    talentMap.set(talent._id.toString(), {
      firstName: talent.firstName,
      lastName: talent.lastName,
      headline: talent.headline
    });
  });

  for (const grade of grades) {
    try {
      const talentId = grade.candidateId;
      const talentInfo = talentMap.get(talentId);

      if (!talentInfo) {
        console.warn(`Talent not found for ID: ${talentId}, skipping...`);
        continue;
      }

      // Determine recommendation level based on grade
      const recommendationLevel = determineRecommendationLevel(grade.grade);

      // Create ranking document
      const ranking = new Ranking({
        jobId,
        talentId,
        rank: grade.rank,
        matchScore: grade.grade,
        snapshot: {
          name: `${talentInfo.firstName} ${talentInfo.lastName}`,
          headline: talentInfo.headline
        },
        strengths: grade.strengths || [],
        gaps: grade.skillGaps
          ? grade.skillGaps.map(gap => gap.skill)
          : grade.missingRequired || [],
        finalRecommendation: grade.recommendation || "",
        recommendationLevel
      });

      await ranking.save();
      savedRankings.push(ranking);

      console.log(`   ✓ Saved ranking for ${talentInfo.firstName} ${talentInfo.lastName}`);
    } catch (error) {
      console.error(`Error saving ranking for candidate ${grade.candidateId}:`, error.message);
    }
  }

  return savedRankings;
}

/**
 * Determine recommendation level based on score
 */
function determineRecommendationLevel(score) {
  if (score >= 70) return "Highly Recommended";
  if (score >= 50) return "Recommended";
  if (score >= 30) return "Consider";
  return "Not Recommended";
}