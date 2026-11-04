
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  totalCopies: number;
  createdAt?: string;
}

type SortOption = "default" | "low-to-high" | "high-to-low";

function BooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    document.title = "BookNook | All Books";

    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const data: Book[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid books data received.");
        }

        if (isMounted) {
          setBooks(data);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);

        if (isMounted) {
          setError("Unable to load books. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Category filter
  const filteredBooks = selectedCategory
    ? books.filter(
        (book) =>
          book.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : books;

  // Sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === "low-to-high") {
      return a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
        numeric: true,
      });
    }

    if (sortOption === "high-to-low") {
      return b.title.localeCompare(a.title, undefined, {
        sensitivity: "base",
        numeric: true,
      });
    }

    // Default: newest books first
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return dateB - dateA;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">
          {selectedCategory
            ? `${selectedCategory} Books`
            : "All Library Books"}
        </h1>

        <p className="mt-2 text-gray-500">
          {selectedCategory
            ? `Explore our collection of ${selectedCategory} books.`
            : "Explore our complete collection of books."}
        </p>
      </div>

      {/* Filter and Sort */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-medium text-gray-600">
          {loading ? "Loading books..." : `${filteredBooks.length} books found`}
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label
            htmlFor="sort-books"
            className="whitespace-nowrap text-sm font-medium"
          >
            Sort by:
          </label>

          <select
            id="sort-books"
            value={sortOption}
            onChange={(e) =>
              setSortOption(e.target.value as SortOption)
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm sm:w-52"
          >
            <option value="default">Default (Newest First)</option>
            <option value="low-to-high">Title (A to Z)</option>
            <option value="high-to-low">Title (Z to A)</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <span className="ml-3 text-gray-600">Loading books...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-16 text-center">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sortedBooks.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <h2 className="mb-2 text-2xl font-semibold">
            No Books Found
          </h2>

          <p className="mb-5 text-gray-500">
            {selectedCategory
              ? "There are no books in this category yet."
              : "Our library is currently empty. Add the first book!"}
          </p>

          {selectedCategory && (
            <Link
              href="/books"
              className="mr-2 inline-block rounded-md bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
            >
              View All Books
            </Link>
          )}

          <Link
            href="/add-book"
            className="inline-block rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Add a Book
          </Link>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && sortedBooks.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBooks.map((book) => (
            <div
              key={book._id}
              className="card flex flex-col justify-between border bg-base-100 shadow-xl"
            >
              <figure className="h-60 overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <span className="badge badge-secondary">
                  {book.category}
                </span>

                <h3 className="card-title text-xl font-bold">
                  {book.title}
                </h3>

                <p className="text-sm font-medium text-gray-600">
                  Author: {book.author}
                </p>

                <p className="text-sm text-gray-500">
                  Available Copies: {book.totalCopies}
                </p>

                <div className="card-actions mt-4">
                  <Link
                    href={`/books/${book._id}`}
                    className="btn btn-primary btn-sm w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllBooks() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-60 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <span className="ml-3">Loading...</span>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
