
"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Check existing login session
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
      router.refresh();
    }
  }, [session, isPending, router]);

  // Email and Password Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } =
        await authClient.signIn.email({
          email: email.trim(),
          password,
        });

      if (authError) {
        throw new Error(
          authError.message || "Invalid email or password."
        );
      }

      if (!data) {
        throw new Error("Login failed. Please try again.");
      }

      // Fetch updated session
      const sessionResult = await authClient.getSession();

      if (!sessionResult.data?.user) {
        throw new Error(
          "Login succeeded, but session could not be loaded. Please try again."
        );
      }

      toast.success("Login successful!");

      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Email login error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Invalid email or password.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError("");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
        errorCallbackURL: "http://localhost:3000/login",
      });
    } catch (err) {
      console.error("Google login error:", err);

      setError("Google login failed. Please try again.");
      toast.error("Google login failed.");

      setGoogleLoading(false);
    }
  };

  // Wait until session check finishes
  if (isPending) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Already logged in: do not show login form
  if (session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please sign in to your BookNook account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Email Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200" />

          <span className="px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Or continue with
          </span>

          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>

          <span>
            {googleLoading
              ? "Redirecting to Google..."
              : "Continue with Google"}
          </span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
