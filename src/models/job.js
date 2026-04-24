import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },

  // Short description / role summary
  description: {
    type: String
  },

  // Experience (as shown: "2+ years")
  experience: {
    type: String
  },

  // Skills list
  skills: [
    {
      type: String
    }
  ],

  // Requirements list
  requirements: [
    {
      type: String
    }
  ],

  // Deadline
  applicationDeadline: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("Job", jobSchema);