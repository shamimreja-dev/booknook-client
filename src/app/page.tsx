"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function Home() {
  const [latestBooks, setLatestBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/books/latest')
      .then(res => res.json())
      .then(data => setLatestBooks(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Banner / Slider */}
      <div className="h-[450px] w-full">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          navigation
          className="h-full"
        >
          <SwiperSlide className="bg-cover bg-center flex items-center justify-center text-white bg-[url('https://i.ibb.co.com/8K5y6J1/banner1.jpg')] bg-neutral/80 bg-blend-overlay p-12">
            <div className="text-center space-y-4 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold">Discover Your Next Favorite Book</h1>
              <p className="text-sm md:text-base">Explore thousands of books across multiple categories and borrow them instantly.</p>
              <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
            </div>
          </SwiperSlide>
          <SwiperSlide className="bg-cover bg-center flex items-center justify-center text-white bg-[url('https://i.ibb.co.com/9V7z4X2/banner2.jpg')] bg-neutral/80 bg-blend-overlay p-12">
            <div className="text-center space-y-4 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold">Small Library, Endless Knowledge</h1>
              <p className="text-sm md:text-base">Add new books to our community library and manage your borrows effortlessly.</p>
              <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
            </div>
          </SwiperSlide>
          <SwiperSlide className="bg-cover bg-center flex items-center justify-center text-white bg-[url('https://i.ibb.co.com/2s3K6L5/banner3.jpg')] bg-neutral/80 bg-blend-overlay p-12">
            <div className="text-center space-y-4 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold">Read, Borrow, and Return</h1>
              <p className="text-sm md:text-base">Simple and seamless online library management designed for book lovers.</p>
              <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <p className="text-gray-500 mt-2">Check out the latest books added to our library collection.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBooks.map((book: any) => (
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
        <div className="text-center mt-10">
          <Link href="/books" className="btn btn-outline btn-primary px-8">See All Books</Link>
        </div>
      </div>

      {/* Extra Section 1: How Borrowing Works */}
      <div className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">How Borrowing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-base-100 rounded-xl shadow">
              <div className="text-4xl mb-4 font-bold text-primary">01</div>
              <h3 className="text-xl font-semibold mb-2">Find Your Book</h3>
              <p className="text-sm text-gray-500">Browse through our extensive catalog and choose the book you wish to read.</p>
            </div>
            <div className="p-6 bg-base-100 rounded-xl shadow">
              <div className="text-4xl mb-4 font-bold text-primary">02</div>
              <h3 className="text-xl font-semibold mb-2">Click Borrow</h3>
              <p className="text-sm text-gray-500">View book details and submit a borrow request securely with a single click.</p>
            </div>
            <div className="p-6 bg-base-100 rounded-xl shadow">
              <div className="text-4xl mb-4 font-bold text-primary">03</div>
              <h3 className="text-xl font-semibold mb-2">Read & Return</h3>
              <p className="text-sm text-gray-500">Enjoy reading your book and return it from your dashboard when finished.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Section 2: Top Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Top Categories</h2>
          <p className="text-gray-500 mt-2">Explore books grouped by your favorite genres.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {["Fiction", "Science", "History", "Kids", "Others"].map((cat) => (
            <Link key={cat} href={`/books?category=${cat}`} className="p-6 bg-primary/10 rounded-xl font-bold text-primary hover:bg-primary hover:text-white transition shadow">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}