'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // পেজ টাইপ সেট করা
    document.title = 'BookNook | Add Book';

    const email = localStorage.getItem('user-email');
    if (!email) {
      alert('Please login first to add a book!');
      router.push('/login');
      return;
    }
    setUserEmail(email);
    setUserName(email.split('@')[0]);
  }, [router]);

  const handleAddBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const author = (form.elements.namedItem('author') as HTMLInputElement).value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
    const image = (form.elements.namedItem('image') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
    const totalCopies = parseInt((form.elements.namedItem('totalCopies') as HTMLInputElement).value);

    const newBook = {
      title,
      author,
      category,
      image,
      description,
      totalCopies,
      userName,
      userEmail,
      createdAt: new Date()
    };

    try {
      const res = await axios.post('http://localhost:5000/books', newBook);
      if (res.status === 200 || res.status === 201) {
        alert('Book added successfully!');
        router.push('/books');
      }
    } catch (err) {
      console.error('Failed to add book:', err);
      alert('Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add a New Book</h1>
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Book Title</label>
            <input type="text" name="title" required className="w-full px-3 py-2 border rounded-md" placeholder="Enter book title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author Name</label>
            <input type="text" name="author" required className="w-full px-3 py-2 border rounded-md" placeholder="Enter author name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" required className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Book Image URL (Imgbb/Postimage)</label>
            <input type="url" name="image" required className="w-full px-3 py-2 border rounded-md" placeholder="Paste image direct URL" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Copies</label>
            <input type="number" name="totalCopies" min="1" required className="w-full px-3 py-2 border rounded-md" placeholder="Number of available copies" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea name="description" rows={4} required className="w-full px-3 py-2 border rounded-md" placeholder="Write a short description..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User Name</label>
              <input type="text" value={userName} readOnly className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User Email</label>
              <input type="email" value={userEmail} readOnly className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
}