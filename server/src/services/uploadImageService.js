import cloudinary from "../config/cloudinary.js";

// UPLOAD MENUS IMAGES
export const uploadImageService = async (
  fileBuffer
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "our-little-space/menus", // create new folder and upload into this folder
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });
};