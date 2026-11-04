
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function MyProfilePage() {
  const router = useRouter();

  const { data: session, isPending, refetch } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleUpdateProfile = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (image.trim()) {
      try {
        const imageUrl = new URL(image.trim());

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          toast.error("Please enter a valid image URL.");
          return;
        }
      } catch {
        toast.error("Please enter a valid image URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Failed to update profile."
        );
        return;
      }

      await refetch();

      window.dispatchEvent(new Event("profileUpdated"));

      toast.success("Profile updated successfully!");

      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Toaster position="top-center" />

      <div className="w-full max-w-lg rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            Manage your BookNook account information.
          </p>
        </div>

        {/* Profile Image */}
        <div className="mb-7 flex flex-col items-center">
          <img
            src={
              image.trim() ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-primary object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />

          <p className="mt-3 text-sm font-semibold">
            {session.user.name || "BookNook User"}
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              minLength={2}
              className="input input-bordered w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="input input-bordered w-full cursor-not-allowed bg-base-200"
            />

            <p className="mt-1 text-xs text-base-content/50">
              Email address cannot be changed.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Profile Photo URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full"
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
