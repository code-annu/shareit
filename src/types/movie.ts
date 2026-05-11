export interface Movie {
  id: string;
  publicId: string;
  secureUrl: string;
  originalFilename: string;
  createdAt: string;
  bytes: number;
  duration: number;
  thumbnailUrl: string;
  format: string;
}

export interface MovieUploadResponse {
  success: boolean;
  movie?: Movie;
  error?: string;
}

export interface MoviesListResponse {
  success: boolean;
  movies: Movie[];
  error?: string;
}

export interface MovieDeleteResponse {
  success: boolean;
  error?: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  created_at: string;
  bytes: number;
  duration: number;
  format: string;
  resource_type: string;
  thumbnail_url?: string;
}
