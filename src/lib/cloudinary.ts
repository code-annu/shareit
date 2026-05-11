import { v2 as cloudinary } from "cloudinary";

// Server-side only — never import this file on the client
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Generate a thumbnail URL for a video.
 * Cloudinary auto-generates thumbnails for videos.
 */
export function getVideoThumbnail(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      { width: 640, height: 360, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "jpg" },
    ],
  });
}

/**
 * Delete a video from Cloudinary by its public_id.
 */
export async function deleteVideo(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true,
  });
}
