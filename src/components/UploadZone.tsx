"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileVideo, X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "./ui/ProgressBar";
import {
  ACCEPTED_VIDEO_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  ACCEPTED_EXTENSIONS,
} from "@/lib/constants";
import { formatFileSize } from "@/lib/format";

type UploadStatus = "idle" | "uploading" | "saving" | "done" | "error";

export default function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const uploadToCloudinary = async (f: File) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

    // Cloudinary recommends chunked uploads for large files (Upload Widget does this automatically).
    // We'll do a manual chunked upload when the file is large to avoid browser/network flakiness.
    const CHUNK_SIZE_BYTES = 20 * 1024 * 1024; // 20MB default
    const shouldChunk = f.size > CHUNK_SIZE_BYTES;

    if (!shouldChunk) {
      const formData = new FormData();
      formData.append("file", f);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("resource_type", "video");
      formData.append("folder", "shareit");

      const res = await axios.post(cloudinaryUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const pct = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(pct);
        },
        timeout: 0,
      });
      return res.data;
    }

    const uploadId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    let start = 0;
    let finalData: any = null;

    while (start < f.size) {
      const endExclusive = Math.min(start + CHUNK_SIZE_BYTES, f.size);
      const endInclusive = endExclusive - 1;
      const chunk = f.slice(start, endExclusive);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("resource_type", "video");
      formData.append("folder", "shareit");

      const res = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Range": `bytes ${start}-${endInclusive}/${f.size}`,
          "X-Unique-Upload-Id": uploadId,
        },
        onUploadProgress: (evt) => {
          const loaded = evt.loaded || 0;
          const overallLoaded = Math.min(start + loaded, f.size);
          setProgress(Math.round((overallLoaded * 100) / f.size));
        },
        timeout: 0,
      });

      // Cloudinary returns the final upload response on the last chunk.
      finalData = res.data;
      start = endExclusive;
    }

    return finalData;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrorMessage("");
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    // Validate size
    if (selectedFile.size > MAX_UPLOAD_SIZE_BYTES) {
      setErrorMessage(
        `File too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${formatFileSize(selectedFile.size)}.`
      );
      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    multiple: false,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-invalid-type") {
        setErrorMessage(
          `Invalid file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
        );
      } else if (err?.code === "file-too-large") {
        setErrorMessage(`File too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`);
      } else {
        setErrorMessage(err?.message || "File rejected");
      }
    },
  });

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    // Check configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      const missing = [];
      if (!CLOUDINARY_CLOUD_NAME) missing.push("Cloud Name");
      if (!CLOUDINARY_UPLOAD_PRESET) missing.push("Upload Preset");
      
      const msg = `Missing Cloudinary configuration: ${missing.join(", ")}. Please check your .env file.`;
      setErrorMessage(msg);
      toast.error("Configuration error");
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setErrorMessage("");

    try {
      // Step 1: Upload directly to Cloudinary (chunked for large files)
      const cloudData = await uploadToCloudinary(file);

      // Step 2: Save metadata to our API
      setStatus("saving");

      const movieData = {
        publicId: cloudData.public_id,
        secureUrl: cloudData.secure_url,
        originalFilename: file.name.replace(/\.[^.]+$/, ""),
        bytes: cloudData.bytes,
        duration: cloudData.duration || 0,
        format: cloudData.format,
      };

      const saveResponse = await axios.post("/api/movies", movieData);

      if (saveResponse.data.success) {
        setStatus("done");
        toast.success("Movie uploaded successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        throw new Error(saveResponse.data.error || "Failed to save movie");
      }
    } catch (error) {
      console.error("Upload process error:", error);
      setStatus("error");
      
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          error.message;

        // For very large uploads, some failures come back as network errors (connection reset/blocked),
        // even though cloud name is correct. Surface a more actionable hint.
        if (error.code === "ERR_NETWORK") {
          setErrorMessage(
            `Upload failed: network connection dropped during upload. For large files, ensure your Cloudinary plan/preset allows the file size and try again on a stable connection. (${msg})`
          );
        } else {
          setErrorMessage(`Upload failed: ${msg}`);
        }
      } else if (error instanceof Error) {
        setErrorMessage(`Upload failed: ${error.message}`);
      } else {
        setErrorMessage("Upload failed. Please try again.");
      }
      toast.error("Upload failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 animate-fadeIn">
      {/* Drop zone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
            isDragActive
              ? "border-red-500 bg-red-600/5 shadow-lg shadow-red-600/10"
              : "border-neutral-700 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-900/80"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                isDragActive
                  ? "bg-red-600/20 text-red-400 scale-110"
                  : "bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700 group-hover:text-neutral-400"
              }`}
            >
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="text-base font-medium text-neutral-200">
                {isDragActive
                  ? "Drop your video here"
                  : "Drag & drop your video here"}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                or click to browse files
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {ACCEPTED_EXTENSIONS.map((ext) => (
                <span
                  key={ext}
                  className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs text-neutral-500"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-600">
              Maximum file size: {MAX_UPLOAD_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-5">
          {/* File info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10">
              <FileVideo className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            {status === "idle" && (
              <button
                onClick={removeFile}
                className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {status === "done" && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
          </div>

          {/* Progress bar */}
          {(status === "uploading" || status === "saving") && (
            <div className="space-y-2">
              <ProgressBar
                progress={status === "saving" ? 100 : progress}
                label={
                  status === "saving"
                    ? "Saving movie data..."
                    : "Uploading to cloud..."
                }
              />
            </div>
          )}

          {/* Upload button */}
          {status === "idle" && (
            <button
              onClick={handleUpload}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/25 active:scale-[0.98]"
            >
              Upload Movie
            </button>
          )}

          {/* Done message */}
          {status === "done" && (
            <p className="text-center text-sm text-green-400">
              Upload complete! Redirecting to dashboard...
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 animate-slideUp">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
