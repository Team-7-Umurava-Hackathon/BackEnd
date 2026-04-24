import Job from "../models/job.js";


// =====================
// CREATE JOB
// =====================
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      experience,
      skills,
      requirements,
      applicationDeadline
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        message: "Title and company are required"
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      experience,
      skills,
      requirements,
      applicationDeadline
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// GET ALL JOBS
// =====================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// GET SINGLE JOB
// =====================
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// UPDATE JOB
// =====================
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// =====================
// DELETE JOB
// =====================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};