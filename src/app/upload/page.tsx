"use client";

import { Upload } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";

function UploadContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
            <Upload className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Upload Movie</h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
            Upload your video file and it will be securely stored in the cloud.
            Share it with anyone who has access.
          </p>
        </div>

        {/* Upload zone */}
        <UploadZone />
      </main>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadContent />
    </AuthGuard>
  );
}
