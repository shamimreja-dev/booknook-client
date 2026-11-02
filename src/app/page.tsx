'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch books from backend API
    axios.get('http://localhost:5000/books')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading books...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Books Section */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Available Books</h2>
      
      {books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg mb-4">No books found in the database. Please add some books first!</p>
          <Link 
            href="/add-book" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Add Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <img 
                  src={book.image || 'https://via.placeholder.com/150'} 
                  alt={book.title} 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-xl font-bold mb-1 text-gray-800">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Author: {book.author}</p>
                <p className="text-gray-500 text-sm mb-4">Category: {book.category}</p>
                <p className="text-sm font-semibold text-green-600 mb-4">Available Copies: {book.totalCopies}</p>
              </div>
              <Link 
                href={`/books/${book._id}`} 
                className="w-full text-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}