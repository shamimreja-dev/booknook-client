
"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
  userEmail: string;
  userName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get JWT token
  const getAuthHeaders = async () => {
    const tokenResult = await authClient.token();
    const token = tokenResult.data?.token;

    if (!token) {
      throw new Error("AUTH_TOKEN_MISSING");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch logged-in user's books
  useEffect(() => {
    document.title = "BookNook | My Books";

    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    let isMounted = true;

    const fetchMyBooks = async () => {
      try {
        setLoading(true);

        const headers = await getAuthHeaders();

        const res = await axios.get(`${API_URL}/books`, {
          headers,
          withCredentials: true,
        });

        if (!isMounted) return;

        const myBooks: Book[] = res.data.filter(
          (book: Book) =>
            book.userEmail?.toLowerCase() ===
            session.user.email?.toLowerCase()
        );

        setBooks(myBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);

        if (error instanceof Error && error.message === "AUTH_TOKEN_MISSING") {
          toast.error("Session expired. Please login again.");
          router.replace("/login");
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Please login again.");
          router.replace("/login");
          return;
        }

        toast.error("Failed to fetch your books.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMyBooks();

    return () => {
      isMounted = false;
    };
  }, [session, isPending, router]);

  // Update book
  const handleUpdateSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedBook) return;

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

    if (!title || !author || !category || !image || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    const updatedData = {
      title,
      author,
      category,
      image,
      description,
      totalCopies,
    };

    try {
      setUpdating(true);

      const headers = await getAuthHeaders();

      const res = await axios.patch(
        `${API_URL}/books/${selectedBook._id}`,
        updatedData,
        {
          headers,
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Book updated successfully!");

        setBooks((previousBooks) =>
          previousBooks.map((book) =>
            book._id === selectedBook._id
              ? { ...book, ...updatedData }
              : book
          )
        );

        setIsEditModalOpen(false);
        setSelectedBook(null);
      }
    } catch (error) {
      console.error("Failed to update book:", error);

      if (error instanceof Error && error.message === "AUTH_TOKEN_MISSING") {
        toast.error("Please login again.");
        router.push("/login");
      } else if (
        axios.isAxiosError(error) &&
        error.response?.status === 403
      ) {
        toast.error("You can only edit your own books.");
      } else if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error("Failed to update book.");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Delete book
  const handleDeleteConfirm = async () => {
    if (!bookToDeleteId) return;

    try {
      setDeleting(true);

      const headers = await getAuthHeaders();

      const res = await axios.delete(
        `${API_URL}/books/${bookToDeleteId}`,
        {
          headers,
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Book deleted successfully!");

        setBooks((previousBooks) =>
          previousBooks.filter((book) => book._id !== bookToDeleteId)
        );

        setIsDeleteModalOpen(false);
        setBookToDeleteId(null);
      }
    } catch (error) {
      console.error("Failed to delete book:", error);

      if (error instanceof Error && error.message === "AUTH_TOKEN_MISSING") {
        toast.error("Please login again.");
        router.push("/login");
      } else if (
        axios.isAxiosError(error) &&
        error.response?.status === 403
      ) {
        toast.error("You can only delete your own books.");
      } else if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error("Failed to delete book.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-gray-600">Loading your books...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="py-20 text-center">
        Please login to view your books.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="mb-2 text-3xl font-bold">My Added Books</h1>

      <p className="mb-6 text-gray-600">
        Books added by your account: {books.length}
      </p>

      {books.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="mb-4 text-gray-600">
            You haven't added any books yet.
          </p>

          <button
            onClick={() => router.push("/add-book")}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
            >
              <div>
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <span className="mb-2 inline-block rounded-md bg-blue-100 px-2.5 py-1 text-xs text-blue-800">
                    {book.category}
                  </span>

                  <h2 className="mb-1 truncate text-xl font-bold">
                    {book.title}
                  </h2>

                  <p className="mb-2 text-sm text-gray-600">
                    By {book.author}
                  </p>

                  <p className="mb-4 text-sm font-medium text-gray-500">
                    Copies:{" "}
                    <span className="font-bold text-green-600">
                      {book.totalCopies}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 cursor-pointer rounded-md bg-amber-500 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setBookToDeleteId(book._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold">
              Edit Book: {selectedBook.title}
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Book Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedBook.title}
                  required
                  minLength={2}
                  maxLength={150}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author"
                  defaultValue={selectedBook.author}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={selectedBook.category}
                  required
                  className="w-full rounded-md border bg-white px-3 py-2"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  defaultValue={selectedBook.image}
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Copies
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  defaultValue={selectedBook.totalCopies}
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedBook.description}
                  rows={3}
                  required
                  minLength={10}
                  maxLength={1000}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedBook(null);
                  }}
                  className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Are you sure?
            </h3>

            <p className="mb-6 text-sm text-gray-600">
              Do you really want to delete this book? This process cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setBookToDeleteId(null);
                }}
                disabled={deleting}
                className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="cursor-pointer rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
