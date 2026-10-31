"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">All Library Books</h1>
        <p className="text-gray-500 mt-2">Explore our complete collection of books.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book: any) => (
          <div key={book._id} className="card bg-base-100 shadow-xl border flex flex-col justify-between">
            <figure className="h-60 overflow-hidden">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            </figure>
            <div className="card-body">
              <span className="badge badge-secondary">{book.category}</span>
              <h3 className="card-title text-xl font-bold">{book.title}</h3>
              <p className="text-sm text-gray-600 font-medium">Author: {book.author}</p>
              <div className="card-actions justify-end mt-4">
                <Link href={`/books/${book._id}`} className="btn btn-primary btn-sm w-full">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}