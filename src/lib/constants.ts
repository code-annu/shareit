/** The valid username for authentication */
export const VALID_USERNAME = "ssmriti";

/** Auth storage key in localStorage */
export const AUTH_STORAGE_KEY = "shareit_auth";

/** Max upload size in bytes */
export const MAX_UPLOAD_SIZE_MB = Number(
  process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB || "500"
);
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

/** Accepted video MIME types */
export const ACCEPTED_VIDEO_TYPES: Record<string, string[]> = {
  "video/mp4": [".mp4"],
  "video/x-matroska": [".mkv"],
  "video/avi": [".avi"],
  "video/x-msvideo": [".avi"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
  "video/x-flv": [".flv"],
  "video/x-ms-wmv": [".wmv"],
  "video/3gpp": [".3gp"],
  "video/ogg": [".ogv"],
};

/** Accepted video file extensions (for display) */
export const ACCEPTED_EXTENSIONS = [
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".webm",
  ".flv",
  ".wmv",
  ".3gp",
  ".ogv",
];

/** Cloudinary upload config */
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
