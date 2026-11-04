
"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";

    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    setUserEmail(session.user.email || "");
    setUserName(
      session.user.name ||
        session.user.email?.split("@")[0] ||
        "User"
    );
  }, [session, isPending, router]);

  const handleAddBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    const form = e.currentTarget;

    const title = (
      form.elements.namedItem("title") as HTMLInputElement
    ).value.trim();

    const author = (
      form.elements.namedItem("author") as HTMLInputElement
    ).value.trim();

    const category = (
      form.elements.namedItem("category") as HTMLSelectElement
    ).value;

    const image = (
      form.elements.namedItem("image") as HTMLInputElement
    ).value.trim();

    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value.trim();

    const totalCopies = Number(
      (form.elements.namedItem("totalCopies") as HTMLInputElement).value
    );

    // Form validation
    if (
      !title ||
      !author ||
      !category ||
      !image ||
      !description
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      // Get JWT token from Better Auth
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      const newBook = {
        title,
        author,
        category,
        image,
        description,
        totalCopies,
        userName: session.user.name || userName,
        userEmail: session.user.email || userEmail,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
  `${process.env.NEXT_PUBLIC_API_URL}/books`, 
  newBook, 
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  }
);

      if (response.status === 200 || response.status === 201) {
        toast.success("Book added successfully!");

        form.reset();

        setTimeout(() => {
          router.push("/books");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to add book:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error;

        if (error.response?.status === 401) {
          toast.error("Your session expired. Please login again.");
          router.push("/login");
        } else {
          toast.error(message || "Failed to add book. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Add a New Book
        </h1>

        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={2}
              maxLength={150}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue=""
              className="w-full rounded-md border bg-white px-3 py-2"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Book Image URL
            </label>
            <input
              type="url"
              name="image"
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="Paste direct image URL"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Total Copies
            </label>
            <input
              type="number"
              name="totalCopies"
              min="1"
              step="1"
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="Number of available copies"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              minLength={10}
              maxLength={1000}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Write a short description..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                readOnly
                className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                User Email
              </label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !session?.user}
            className="w-full cursor-pointer rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
