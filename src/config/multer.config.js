import multer from "multer";
import path from "path";
import fs from "fs"; // Required for creating directories

/**
 * Multer Configuration for Profile Picture Uploads
 *
 * This storage configuration handles the destination and naming of profile pictures.
 * - **Destination**: Files are stored in the `pictures/profile.pictures` directory.
 * - **Directory Handling**: Ensures the directory exists using `fs.mkdirSync()`.
 * - **File Naming**: Appends a timestamp (`Date.now()`) to the original filename,
 *   replacing spaces with underscores for better URL compatibility.
 */
const profilePostStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const profile_pic_path = path.join(
      path.resolve(),
      "pictures",
      "profile.pictures"
    );

    // Ensure the directory exists before storing the file
    fs.mkdirSync(profile_pic_path, { recursive: true });

    cb(null, profile_pic_path);
  },
  filename: (req, file, cb) => {
    const date_stamp = Date.now();
    const file_name = file.originalname.replace(/\s+/g, "_");
    cb(null, `${date_stamp}_${file_name}`);
  },
});

/**
 * Multer Configuration for Post Picture Uploads
 *
 * This storage configuration manages post image uploads.
 * - **Destination**: Files are stored in the `pictures/post.pictures` directory.
 * - **Directory Handling**: Ensures the directory exists using `fs.mkdirSync()`.
 * - **File Naming**: A timestamp is added to the original filename,
 *   and spaces are replaced with underscores.
 */
const postStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const post_pic_path = path.join(
      path.resolve(),
      "pictures",
      "post.pictures"
    );

    // Ensure the directory exists before storing the file
    fs.mkdirSync(post_pic_path, { recursive: true });

    cb(null, post_pic_path);
  },
  filename: (req, file, cb) => {
    const date_stamp = Date.now();
    const file_name = file.originalname.replace(/\s+/g, "_");
    cb(null, `${date_stamp}_${file_name}`);
  },
});

/**
 * Allowed Image Extensions
 *
 * - Defines a regular expression that checks for valid image file extensions.
 * - Ensures only image files with supported formats are processed.
 */
const allowedExtensions =
  /\.(jpeg|jpg|png|gif|bmp|webp|tiff|tif|svg|ico|heic|heif|raw)$/i;

/**
 * Allowed MIME Types
 *
 * - Defines a list of permitted MIME types for images.
 * - Ensures only valid image file types are accepted by the server.
 */
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/tiff",
  "image/svg+xml",
  "image/x-icon",
  "image/heif",
  "image/heic",
];

/**
 * File Filter Function for Multer
 *
 * - Validates uploaded files based on extension and MIME type.
 * - If both checks pass, the file is accepted.
 * - Otherwise, an error is returned, preventing upload.
 */
const fileFilter = (req, file, cb) => {
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed for profile picture upload"), false);
  }
};

/**
 * Multer Instance for Profile Picture Uploads
 *
 * - Uses `profilePostStorageConfig` for file storage.
 * - Applies the `fileFilter` to validate file types.
 * - Restricts file size to **2MB**.
 */
export const profileUpload = multer({
  storage: profilePostStorageConfig,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
});

/**
 * Multer Instance for Post Picture Uploads
 *
 * - Uses `postStorageConfig` for file storage.
 * - Applies the `fileFilter` to validate file types.
 * - Restricts file size to **2MB**.
 */
export const postUpload = multer({
  storage: postStorageConfig,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
});
