import {getCloudinary} from "../config/cloudinary.js";
import streamifier from "streamifier";


export const uploadToCloudinary = (fileBuffer,originalName, folder = "resumes") => {
  return new Promise((resolve, reject) => {
   
   

    const stream = getCloudinary().uploader.upload_stream(
      {
        folder,
        // format: "pdf",
        resource_type: "raw", // important for PDFs
        public_id: "resumes/resume.pdf",
  
    },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};