import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getMovies, addMovie } from "@/lib/movies-db";
import { getVideoThumbnail } from "@/lib/cloudinary";
import { Movie } from "@/types/movie";

/**
 * GET /api/movies
 * Returns all movies sorted by createdAt (newest first).
 */
export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json({ success: true, movies });
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return NextResponse.json(
      { success: false, movies: [], error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/movies
 * Saves movie metadata after a direct Cloudinary upload from the browser.
 *
 * Expected body:
 * {
 *   publicId: string;
 *   secureUrl: string;
 *   originalFilename: string;
 *   bytes: number;
 *   duration: number;
 *   format: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { publicId, secureUrl, originalFilename, bytes, duration, format } =
      body;

    if (!publicId || !secureUrl || !originalFilename) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate thumbnail URL from Cloudinary
    const thumbnailUrl = getVideoThumbnail(publicId);

    const movie: Movie = {
      id: uuidv4(),
      publicId,
      secureUrl,
      originalFilename,
      createdAt: new Date().toISOString(),
      bytes: bytes || 0,
      duration: duration || 0,
      thumbnailUrl,
      format: format || "mp4",
    };

    const saved = await addMovie(movie);

    return NextResponse.json({ success: true, movie: saved }, { status: 201 });
  } catch (error) {
    console.error("Failed to save movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save movie metadata" },
      { status: 500 }
    );
  }
}
