'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'BookNook | Home';
    axios.get('http://localhost:5000/books')
      .then(res => {
        // নতুন বইগুলো প্রথমে দেখানোর জন্য সর্ট এবং লিমিট ৬টি
        const sortedBooks = res.data.sort((a: Book, b: Book) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setNewArrivals(sortedBooks.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Banner / Slider Section */}
      <section className="w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full h-[450px]"
        >
          <SwiperSlide className="bg-blue-900 text-white flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BookNook</h1>
            <p className="text-lg max-w-xl mb-6 text-gray-200">Discover your next favorite book, explore thousands of titles, and borrow with ease.</p>
            <Link href="/books" className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-md hover:bg-gray-100 transition">
              Browse Books
            </Link>
          </SwiperSlide>
          <SwiperSlide className="bg-emerald-900 text-white flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Expand Your Knowledge</h1>
            <p className="text-lg max-w-xl mb-6 text-gray-200">From Fiction to Science, find a vast collection of books curated for avid readers.</p>
            <Link href="/books" className="px-6 py-3 bg-white text-emerald-900 font-semibold rounded-md hover:bg-gray-100 transition">
              Browse Books
            </Link>
          </SwiperSlide>
          <SwiperSlide className="bg-indigo-900 text-white flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Borrow & Return Seamlessly</h1>
            <p className="text-lg max-w-xl mb-6 text-gray-200">Manage your borrowed books, track return dates, and keep reading without interruptions.</p>
            <Link href="/books" className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-md hover:bg-gray-100 transition">
              Browse Books
            </Link>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
          <Link href="/books" className="text-blue-600 hover:underline font-semibold">See All Books</Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading new arrivals...</div>
        ) : newArrivals.length === 0 ? (
          <p className="text-gray-600 text-center">No books available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between border border-gray-200 hover:shadow-lg transition">
                <div>
                  <img src={book.image} alt={book.title} className="w-full h-60 object-cover" />
                  <div className="p-5">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md mb-2">
                      {book.category}
                    </span>
                    <h3 className="text-xl font-bold mb-1 truncate">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">By {book.author}</p>
                    <p className="text-sm font-medium text-gray-500">
                      Available Copies: <span className="text-green-600 font-bold">{book.totalCopies}</span>
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link
                    href={`/books/${book._id}`}
                    className="block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/books" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
            See All Books
          </Link>
        </div>
      </section>

      {/* Extra Section 1: How Borrowing Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">How Borrowing Works</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-12">Get your favorite books in three simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-gray-600 text-sm">Explore our library collection and choose the book you want to read.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Borrow Online</h3>
              <p className="text-gray-600 text-sm">Click borrow, set your return date, and confirm your borrowing instantly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Read & Return</h3>
              <p className="text-gray-600 text-sm">Enjoy reading your book and return it from your dashboard when finished.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Top Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">Top Categories</h2>
        <p className="text-gray-600 text-center mb-10">Explore books based on your favorite genres.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Fiction', 'Science', 'History', 'Kids', 'Others'].map((cat) => (
            <Link key={cat} href="/books" className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center hover:bg-blue-100 transition">
              <h3 className="text-lg font-bold text-blue-800">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}