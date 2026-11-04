
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import HeroSlider from "./components/HeroSlider";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies: number;
  createdAt?: string;
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | Home";

    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");

        const books: Book[] = Array.isArray(response.data)
          ? response.data
          : [];

        const sortedBooks = [...books].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );

        setNewArrivals(sortedBooks.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Unable to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <main className="space-y-20 pb-16">
      {/* Hero Slider */}
      <section className="px-3 pt-6 md:px-6">
        <HeroSlider />
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 font-semibold text-primary">
              OUR COLLECTION
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-base-content/60">
              Discover the latest additions to our library.
            </p>
          </div>

          <Link href="/books" className="btn btn-outline btn-primary">
            See All Books →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-base-300"
              >
                <div className="skeleton h-60 w-full" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-6 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-error/10 p-8 text-center text-error">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-sm btn-error mt-4 text-white"
            >
              Try Again
            </button>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="rounded-xl bg-base-200 py-12 text-center">
            <p className="text-lg font-semibold">No books available yet.</p>
            <p className="mt-2 text-base-content/60">
              Please check back later for new arrivals.
            </p>
            <Link href="/books" className="btn btn-primary mt-5">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((book) => (
              <article
                key={book._id}
                className="flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={
                    book.image ||
                    "https://placehold.co/600x400?text=BookNook"
                  }
                  alt={book.title}
                  className="h-60 w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {book.category}
                  </span>

                  <h3 className="mb-2 text-xl font-bold">
                    {book.title}
                  </h3>

                  <p className="mb-4 text-sm text-base-content/60">
                    By {book.author}
                  </p>

                  <p className="mb-5 text-sm">
                    Available Copies:{" "}
                    <span
                      className={
                        book.totalCopies > 0
                          ? "font-bold text-success"
                          : "font-bold text-error"
                      }
                    >
                      {book.totalCopies}
                    </span>
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="btn btn-primary mt-auto w-full"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/books" className="btn btn-primary px-10">
            Explore All Books
          </Link>
        </div>
      </section>

      {/* Extra Section 1: How Borrowing Works */}
      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 font-semibold text-primary">
              SIMPLE PROCESS
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              How Borrowing Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base-content/60">
              Get your favorite books in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: "🔎",
                title: "Browse & Select",
                description:
                  "Explore our library collection and choose the book you want to read.",
              },
              {
                number: "02",
                icon: "📚",
                title: "Borrow Online",
                description:
                  "Choose your borrow and return dates and confirm your borrowing.",
              },
              {
                number: "03",
                icon: "📖",
                title: "Read & Return",
                description:
                  "Enjoy reading your book and return it when you are finished.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-xl bg-base-100 p-8 text-center shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-4 text-5xl">{step.icon}</div>
                <span className="font-bold text-primary">
                  STEP {step.number}
                </span>
                <h3 className="mb-3 mt-2 text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-sm leading-7 text-base-content/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 2: Top Categories */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-primary">
            FIND YOUR INTEREST
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Explore Top Categories
          </h2>
          <p className="mt-3 text-base-content/60">
            Discover books based on your favorite genres.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            { name: "Fiction", icon: "📖" },
            { name: "Science", icon: "🔬" },
            { name: "History", icon: "🏛️" },
            { name: "Kids", icon: "🧸" },
            { name: "Others", icon: "📚" },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/books?category=${category.name}`}
              className="rounded-xl border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-3 block text-4xl">
                {category.icon}
              </span>
              <h3 className="font-bold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
