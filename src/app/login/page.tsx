"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Film, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormValues } from "@/types/auth";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    const result = login(data.username);

    if (result.success) {
      router.replace("/dashboard");
    } else {
      setError(result.error || "Access denied");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-red-800/5 blur-3xl" />
      </div>

      {/* Login card */}
      <div
        className={`relative z-10 w-full max-w-md animate-slideUp ${isShaking ? "animate-shake" : ""}`}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Share<span className="text-red-500">It</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Private movie sharing platform
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="mb-1 text-lg font-semibold text-neutral-100">
            Welcome back
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            Enter your username to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-neutral-400"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                placeholder="Enter your username"
                className="w-full rounded-xl border border-neutral-700/50 bg-neutral-800/50 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-all duration-200 focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20"
                {...register("username", { required: true })}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-900/50 p-3 animate-slideUp">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/25 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-700">
          Private access only • Authorized users
        </p>
      </div>
    </div>
  );
}
