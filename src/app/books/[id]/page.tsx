'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

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
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [borrowDate, setBorrowDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');

  // বইয়ের ডাটা ফেচ করা
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/books/${id}`)
        .then(res => {
          setBook(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch book details:', err);
          setLoading(false);
        });
    }
  }, [id]);

  // বই বরো করার হ্যান্ডলার
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('user-email');

    if (!userEmail) {
      alert('Please login first to borrow a book!');
      router.push('/login');
      return;
    }

    try {
      const borrowData = {
        bookId: book?._id,
        bookTitle: book?.title,
        userEmail,
        borrowDate,
        returnDate
      };

      const res = await axios.post('http://localhost:5000/borrows', borrowData);
      if (res.status === 200 || res.status === 201) {
        alert('Book borrowed successfully!');
        setIsModalOpen(false);
        router.push('/dashboard/my-borrows'); // অথবা আপনার বরো পেজে রিডাইরেক্ট হবে
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to borrow book.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading book details...</div>;
  if (!book) return <div className="text-center py-20 text-red-500">Book not found!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
        <img src={book.image} alt={book.title} className="w-full h-96 object-cover rounded-md" />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">By <span className="font-semibold">{book.author}</span></p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md mb-4">
              {book.category}
            </span>
            <p className="text-gray-700 mb-6">{book.description}</p>
            <p className="text-sm font-medium text-gray-500 mb-6">
              Available Copies: <span className="text-green-600 font-bold">{book.totalCopies}</span>
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={book.totalCopies <= 0}
            className={`w-full py-3 rounded-md text-white font-semibold transition ${
              book.totalCopies > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {book.totalCopies > 0 ? 'Borrow Book' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Borrow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Borrow: {book.title}</h3>
            <form onSubmit={handleBorrowSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Borrow Date</label>
                <input
                  type="date"
                  required
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Return Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}