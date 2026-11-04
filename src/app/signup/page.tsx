
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();

    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();

    const image = (
      form.elements.namedItem("image") as HTMLInputElement
    ).value.trim();

    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    // Basic validation
    if (name.length < 2) {
      const message = "Name must contain at least 2 characters.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!image) {
      const message = "Please provide your profile photo URL.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      new URL(image);

      if (!["http:", "https:"].includes(new URL(image).protocol)) {
        throw new Error("Invalid image URL.");
      }
    } catch {
      const message = "Please enter a valid photo URL.";
      setError(message);
      toast.error(message);
      return;
    }

    // Minimum 6 characters, uppercase and lowercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      const message =
        "Password must be at least 6 characters and include uppercase and lowercase letters.";

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const { data, error: signupError } =
        await authClient.signUp.email({
          name,
          email,
          password,
          image,
        });

      if (signupError) {
        throw new Error(
          signupError.message || "Registration failed."
        );
      }

      if (!data) {
        throw new Error("Account creation failed. Please try again.");
      }

      toast.success("Account created successfully! Please login.");

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-100 via-indigo-50/50 to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md rounded-3xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            BN
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Create Account
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Join BookNook library system today
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Profile Photo URL
            </label>

            <input
              type="url"
              name="image"
              required
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Paste a direct image URL.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Must include uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
