"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Upload, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-800/60 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
            <Film className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Share<span className="text-red-500">It</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Upload button */}
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Link>

          {/* User info + logout */}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/20 text-xs font-bold text-red-400">
              {username?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm text-neutral-400 sm:block">
              {username}
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              className="ml-1 rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
