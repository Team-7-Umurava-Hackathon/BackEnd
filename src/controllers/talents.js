import Talent from "../models/talent.js";
import axios from "axios";
import FormData from "form-data";
import { uploadToCloudinary } from "../middleware/uploadCloudinary.js";



// =====================
// CREATE TALENT (APPLY)
// =====================
export const createTalent = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      firstName,
      lastName,
      email,
      headline,
      location
    } = req.body;

    // Required fields
    if (!jobId || !firstName || !lastName || !email || !headline || !location) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const talent = await Talent.create({
  ...req.body,
  job: jobId
});

    res.status(201).json({
      message: "Application submitted successfully",
      talent
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// GET ALL TALENTS
// (with optional job filter)
// =====================
export const getTalents = async (req, res) => {
  try {
    const { jobId } = req.params;

    let filter = {};
    if (jobId) {
      filter.job = jobId;
    }

    const talents = await Talent.find(filter)
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: talents.length,
      talents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// GET TALENTS BY JOB
// =====================
export const getTalentsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const talents = await Talent.find({ job: jobId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: talents.length,
      talents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// GET SINGLE TALENT
// =====================
export const getTalentById = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id).populate("job");

    if (!talent) {
      return res.status(404).json({
        message: "Talent not found"
      });
    }

    res.status(200).json(talent);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};





// =====================
// DELETE TALENT
// =====================
export const deleteTalent = async (req, res) => {
  try {
    const talent = await Talent.findByIdAndDelete(req.params.id);

    if (!talent) {
      return res.status(404).json({
        message: "Talent not found"
      });
    }

    res.status(200).json({
      message: "Talent deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/**
 * Upload and process CV (PDF)
 * POST /api/uploads/cv?type=pdf
 */


export const uploadCVPDF = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📄 Uploading to Cloudinary...");
    console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_API_KEY);

    // 1. Upload PDF to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, "resumes");

    const resumeUrl = cloudinaryResult.secure_url;

    console.log("☁️ Cloudinary URL:", resumeUrl);

    // 2. Extract CV data (AI)
    const extractedData = await sendToExtractionAPI(req.file.buffer, "pdf");

    const email = extractedData?.basicInfo?.email;

    if (!email) {
      return res.status(400).json({
        error: "Email not found in uploaded document",
      });
    }

    // 3. Prevent duplicate applications
    const existing = await Talent.findOne({ email, job: jobId });

    if (existing) {
      return res.status(400).json({
        error: "This email has already applied for this job",
      });
    }

    console.log("💾 Saving talent...");

    // 4. Build talent object
    const talentData = {
      ...transformToTalentSchema(extractedData, jobId),

      // 👇 IMPORTANT ADDITIONS
      structured: false,
      resumeFile: resumeUrl,
      resumeOriginalName: req.file.originalname,
    };

    const talent = new Talent(talentData);
    await talent.save();

    console.log("✅ Saved:", talent._id);

    return res.status(201).json({
      success: true,
      talentId: talent._id,
      resumeUrl,
      data: extractedData,
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
 
/**
 * Upload and process spreadsheet (CSV/XLS)
 * POST /api/uploads/excel?type=csv
 */
export const uploadExcel = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📊 Processing file (CSV/XLS)...");
    const fileName = req.file.originalname.toLowerCase();

let fileType;

if (fileName.endsWith(".csv")) {
  fileType = "csv";
} else if (fileName.endsWith(".xlsx")) {
  fileType = "xlsx";
} else {
  return res.status(400).json({
    error: "Unsupported file type. Only CSV and XLSX are allowed"
  });
}

    // 🔥 ONE AI API for both formats
    const extractedData = await sendToExtractionAPI(
      req.file.buffer,
      fileType
    );

    const savedTalents = [];

    for (const row of extractedData.rows) {
      if (!row.success) continue;

      const talentData = transformToTalentSchema(row.profile, jobId);

      const talent = await Talent.create(talentData);

      savedTalents.push(talent);
    }

    res.status(201).json({
      success: true,
      inserted: savedTalents.length,
      talents: savedTalents
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
 
// Helper function to send file to extraction API
async function sendToExtractionAPI(fileBuffer, type) {
  const apiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  console.log(`apiUrl: ${apiUrl}`);
  const endpoints = {
    pdf: `${apiUrl}/extract/`,
    csv: `${apiUrl}/ingest/spreadsheet`,
    xlsx: `${apiUrl}/ingest/spreadsheet`
  };

  const formData = new FormData();

  // 📌 Proper file handling per type
  const fileConfig = {
    pdf: {
      filename: "upload.pdf",
      contentType: "application/pdf"
    },
    csv: {
      filename: "upload.csv",
      contentType: "text/csv"
    },
    xlsx: {
      filename: "upload.xlsx",
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  };

  const config = fileConfig[type];

  if (!config) {
    throw new Error("Unsupported file type");
  }

  formData.append("file", fileBuffer, config);

  try {
    console.log(`Sending file to: ${endpoints[type]}`);
    const response = await axios.post(endpoints[type], formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    return response.data;

  } catch (error) {
    throw new Error(
      `API error: ${error.response?.data?.error || error.message}`
    );
  }
}
 
// Transform extracted data to Talent schema (only for PDF)
function transformToTalentSchema(extractedData, jobId) {
  // 🔧 Helpers
  const clean = (val, fallback = "") =>
    val === null || val === undefined ? fallback : val;

  const parseYear = (val) => {
    if (!val) return null;
    const str = val.toString();
    const year = parseInt(str.slice(0, 4));
    return isNaN(year) ? null : year;
  };

  return {
    job: jobId,

    // =====================
    // BASIC INFO
    // =====================
    firstName: clean(extractedData?.basicInfo?.firstName),
    lastName: clean(extractedData?.basicInfo?.lastName),
    email: clean(extractedData?.basicInfo?.email),

    headline:
      clean(extractedData?.basicInfo?.headline) ||
      clean(extractedData?.experience?.[0]?.role) ||
      "Professional",

    bio: clean(extractedData?.basicInfo?.bio),
    location: clean(extractedData?.basicInfo?.location),

    // =====================
    // SKILLS
    // =====================
    skills: (extractedData?.skills || [])
      .map((skill) => ({
        name: clean(skill.name),
        level: ["Beginner", "Intermediate", "Advanced", "Expert"].includes(
          skill.level
        )
          ? skill.level
          : "Beginner",
        yearsOfExperience:
          typeof skill.yearsOfExperience === "number"
            ? skill.yearsOfExperience
            : 0
      }))
      .filter((s) => s.name),

    // =====================
    // LANGUAGES
    // =====================
    languages: (extractedData?.languages || [])
      .map((lang) => ({
        name: clean(lang.name),
        proficiency: [
          "Basic",
          "Conversational",
          "Fluent",
          "Native"
        ].includes(lang.proficiency)
          ? lang.proficiency
          : "Basic"
      }))
      .filter((l) => l.name),

    // =====================
    // EXPERIENCE
    // =====================
    experience: (extractedData?.experience || [])
      .map((exp) => ({
        company: clean(exp.company),
        role: clean(exp.role, "Employee"),
        startDate: clean(exp.startDate),
        endDate: clean(exp.endDate),
        description: clean(exp.description),
        technologies: Array.isArray(exp.technologies)
          ? exp.technologies
          : [],
        isCurrent: Boolean(exp.isCurrent)
      }))
      .filter((e) => e.company || e.role),

    // =====================
    // EDUCATION
    // =====================
    education: (extractedData?.education || [])
      .map((edu) => ({
        institution: clean(edu.institution, "Unknown"),
        degree: clean(edu.degree, "Unknown"),
        fieldOfStudy: clean(edu.fieldOfStudy, "Not specified"),
        startYear: parseYear(edu.startYear),
        endYear: parseYear(edu.endYear)
      }))
      .filter((e) => e.institution),

    // =====================
    // CERTIFICATIONS
    // =====================
    certifications: (extractedData?.certifications || [])
      .map((cert) => ({
        name: clean(cert.name),
        issuer: clean(cert.issuer),
        issueDate: clean(cert.issueDate)
      }))
      .filter((c) => c.name),

    // =====================
    // PROJECTS
    // =====================
    projects: (extractedData?.projects || [])
      .map((p) => ({
        name: clean(p.name, "Unnamed Project"),
        description: clean(p.description),
        technologies: Array.isArray(p.technologies)
          ? p.technologies
          : [],
        role: clean(p.role, "Contributor"),
        link: clean(p.link),
        startDate: clean(p.startDate),
        endDate: clean(p.endDate)
      }))
      .filter((p) => p.name),

    // =====================
    // AVAILABILITY
    // =====================
    availability: {
      status: [
        "Available",
        "Open to Opportunities",
        "Not Available"
      ].includes(extractedData?.availability?.status)
        ? extractedData.availability.status
        : "Open to Opportunities",

      type: [
        "Full-time",
        "Part-time",
        "Contract"
      ].includes(extractedData?.availability?.type)
        ? extractedData.availability.type
        : "Full-time",

      startDate: clean(extractedData?.availability?.startDate)
    },

    // =====================
    // SOCIAL LINKS
    // =====================
    socialLinks: {
      linkedin: clean(extractedData?.socialLinks?.linkedin),
      github: clean(extractedData?.socialLinks?.github),
      portfolio: clean(extractedData?.socialLinks?.portfolio)
    }
  };
}