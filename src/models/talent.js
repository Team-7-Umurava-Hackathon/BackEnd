import mongoose from "mongoose";

const talentSchema = new mongoose.Schema({
  // 🔗 Job Reference
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  // ✅ NEW: Resume handling
  structured: {
    type: Boolean,
    default: true // false = uploaded raw CV (pdf, docx)
  },

  resumeFile: {
    type: String, // store file URL or path (NOT file itself)
  },

  resumeOriginalName: {
    type: String, // optional (e.g. "john_cv.pdf")
  },

  // Basic Information
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  headline: { type: String },
  bio: { type: String },
  location: { type: String },

  // Skills & Languages
  skills: [
    {
      name: { type: String },
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      },
      yearsOfExperience: { type: Number }
    }
  ],

  languages: [
    {
      name: String,
      proficiency: {
        type: String,
        enum: ["Basic", "Conversational", "Fluent", "Native"]
      }
    }
  ],

  // Work Experience
  experience: [
    {
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
      technologies: [String],
      isCurrent: { type: Boolean, default: false }
    }
  ],

  // Education
  education: [
    {
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number
    }
  ],

  // Certifications
  certifications: [
    {
      name: String,
      issuer: String,
      issueDate: String
    }
  ],

  // Projects
  projects: [
    {
      name: String,
      description: String,
      technologies: [String],
      role: String,
      link: String,
      startDate: String,
      endDate: String
    }
  ],

  // Availability
  availability: {
    status: {
      type: String,
      enum: ["Available", "Open to Opportunities", "Not Available"],
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
    },
    startDate: String
  },

  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  }

}, { timestamps: true });

// Prevent duplicate applications per job
talentSchema.index({ email: 1, job: 1 }, { unique: true });

export default mongoose.model("Talent", talentSchema);