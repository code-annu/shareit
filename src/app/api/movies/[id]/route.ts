import { NextRequest, NextResponse } from "next/server";
import { deleteMovie, getMovieById } from "@/lib/movies-db";
import { deleteVideo } from "@/lib/cloudinary";

/**
 * GET /api/movies/[id]
 * Returns a single movie by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movie = await getMovieById(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/movies/[id]
 * Deletes a movie from local storage AND from Cloudinary.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find and delete from local storage
    const deleted = await deleteMovie(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      await deleteVideo(deleted.publicId);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete from Cloudinary (continuing anyway):",
        cloudinaryError
      );
      // We still return success since the metadata was removed
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
