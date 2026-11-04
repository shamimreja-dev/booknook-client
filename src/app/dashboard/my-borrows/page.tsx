
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface BorrowItem {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  borrowDate: string;
  returnDate: string;
}

const API_URL = "http://localhost:5000";

export default function MyBorrowsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Get JWT token from Better Auth
  const getAuthHeaders = async () => {
    const tokenResult = await authClient.token();

    if (!tokenResult.data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return {
      Authorization: `Bearer ${tokenResult.data.token}`,
    };
  };

  // Fetch current user's borrowed books
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    let cancelled = false;

    const fetchBorrows = async () => {
      try {
        setLoading(true);

        const headers = await getAuthHeaders();

        const res = await axios.get(`${API_URL}/borrows`, {
          headers,
          withCredentials: true,
        });

        if (!cancelled) {
          setBorrows(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch borrows:", error);

        if (!cancelled) {
          toast.error("Failed to load borrowed books.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBorrows();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  // Return book
  const handleReturnBook = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!isConfirmed) return;

    try {
      setReturningId(id);

      const headers = await getAuthHeaders();

      await axios.delete(`${API_URL}/borrows/${id}`, {
        headers,
        withCredentials: true,
      });

      toast.success("Book returned successfully!");

      setBorrows((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Failed to return book:", error);
      toast.error("Failed to return book.");
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="py-20 text-center">
        Loading your borrowed books...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="py-20 text-center">
        Please login to see your borrowed books.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">
        My Borrowed Books
      </h1>

      {borrows.length === 0 ? (
        <div className="py-10 text-center">
          <p className="mb-4 text-gray-600">
            You haven't borrowed any books yet.
          </p>

          <button
            onClick={() => router.push("/books")}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full border-collapse bg-white text-left">
            <thead className="bg-gray-200 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Borrow Date</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {borrows.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.bookImage && (
                        <img
                          src={item.bookImage}
                          alt={item.bookTitle}
                          className="h-14 w-11 rounded object-cover"
                        />
                      )}

                      <span className="font-medium text-gray-800">
                        {item.bookTitle}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(item.borrowDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(item.returnDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleReturnBook(item._id)}
                      disabled={returningId === item._id}
                      className="cursor-pointer rounded-md bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      {returningId === item._id
                        ? "Returning..."
                        : "Return"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
