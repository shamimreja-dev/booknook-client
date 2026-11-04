
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  // Login protection
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // Fetch book details
  useEffect(() => {
    if (!id || isPending || !session?.user) return;

    const fetchBook = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/books/${id}`
        );

        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        toast.error("Failed to load book details.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, isPending, session]);

  const handleBorrowSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    if (!book || borrowing) return;

    if (book.totalCopies <= 0) {
      toast.error("This book is out of stock.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedBorrowDate = new Date(`${borrowDate}T00:00:00`);
    const selectedReturnDate = new Date(`${returnDate}T00:00:00`);

    if (
      !borrowDate ||
      !returnDate ||
      selectedBorrowDate < today
    ) {
      toast.error("Please select a valid borrow date.");
      return;
    }

    if (selectedReturnDate <= selectedBorrowDate) {
      toast.error("Return date must be after borrow date.");
      return;
    }

    try {
      setBorrowing(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const borrowData = {
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        borrowDate,
        returnDate,
      };

      const res = await axios.post(
        "http://localhost:5000/borrows",
        borrowData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Book borrowed successfully!");

        setIsModalOpen(false);

        setTimeout(() => {
          router.push("/dashboard/my-borrows");
        }, 800);
      }
    } catch (err: unknown) {
      console.error("Borrow error:", err);

      let message = "Failed to borrow book.";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  };

  // Loading state
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="ml-3 text-gray-600">
          Loading book details...
        </span>
      </div>
    );
  }

  // Redirect while unauthenticated
  if (!session?.user) {
    return null;
  }

  // Book not found
  if (!book) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          Book Not Found!
        </h2>

        <p className="mb-5 text-gray-500">
          This book may have been removed or does not exist.
        </p>

        <button
          onClick={() => router.push("/books")}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Browse All Books
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={() => router.back()}
        className="mb-6 text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border bg-white p-6 shadow-lg md:grid-cols-2 md:p-8">
        <div>
          <img
            src={
              book.image ||
              "https://placehold.co/400x500?text=Book"
            }
            alt={book.title}
            className="h-96 w-full rounded-xl object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold text-indigo-700">
              {book.category}
            </span>

            <h1 className="mb-3 text-3xl font-extrabold text-gray-900">
              {book.title}
            </h1>

            <p className="mb-5 text-gray-600">
              By{" "}
              <span className="font-semibold text-gray-900">
                {book.author}
              </span>
            </p>

            <h3 className="mb-2 font-bold text-gray-800">
              Book Description
            </h3>

            <p className="mb-6 leading-7 text-gray-600">
              {book.description || "No description available."}
            </p>

            <div className="mb-7 rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Available Copies
              </p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  book.totalCopies > 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {book.totalCopies}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {book.totalCopies > 0
                  ? "This book is available for borrowing."
                  : "Currently out of stock."}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setBorrowDate("");
              setReturnDate("");
              setIsModalOpen(true);
            }}
            disabled={book.totalCopies <= 0}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {book.totalCopies > 0
              ? "Borrow This Book"
              : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Borrow Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => {
            if (!borrowing) setIsModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Borrow Book
            </h3>

            <p className="mb-5 text-sm text-gray-500">
              You are borrowing:{" "}
              <span className="font-semibold text-gray-800">
                {book.title}
              </span>
            </p>

            <form
              onSubmit={handleBorrowSubmit}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Borrow Date
                </label>

                <input
                  type="date"
                  required
                  value={borrowDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => {
                    setBorrowDate(e.target.value);
                    setReturnDate("");
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Return Date
                </label>

                <input
                  type="date"
                  required
                  value={returnDate}
                  min={borrowDate || new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={borrowing}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-gray-200 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={borrowing}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {borrowing ? "Processing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
