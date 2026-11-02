'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface BorrowItem {
  _id: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string;
}

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('user-email');
    if (!userEmail) {
      alert('Please login first!');
      router.push('/login');
      return;
    }

    // ইউজারের বরো করা বইগুলো ফেচ করা
    axios.get(`http://localhost:5000/borrows?email=${userEmail}`)
      .then(res => {
        setBorrows(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch borrows:', err);
        setLoading(false);
      });
  }, [router]);

  // বই রিটার্ন বা ডিলিট করার হ্যান্ডলার
  const handleReturnBook = async (id: string) => {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
      const res = await axios.delete(`http://localhost:5000/borrows/${id}`);
      if (res.status === 200) {
        alert('Book returned successfully!');
        setBorrows(borrows.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to return book:', err);
      alert('Failed to return book.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading your borrowed books...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Borrowed Books</h1>
      {borrows.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t borrowed any books yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Borrow Date</th>
                <th className="py-3 px-4">Return Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {borrows.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.bookTitle}</td>
                  <td className="py-3 px-4 text-gray-600">{item.borrowDate}</td>
                  <td className="py-3 px-4 text-gray-600">{item.returnDate}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleReturnBook(item._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                    >
                      Return
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