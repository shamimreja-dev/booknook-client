'use client';
import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userEmail: string;
}

export default function MyBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [bookToDeleteId, setBookToDeleteId] = useState<string | null>(null);

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user-email') : '';

  useEffect(() => {
    document.title = 'BookNook | My Books';
    if (!userEmail) {
      alert('Please login first!');
      router.push('/login');
      return;
    }

    axios.get('http://localhost:5000/books')
      .then(res => {
        // শুধু লগইন করা ইউজারের যোগ করা বইগুলো ফিল্টার করা
        const myBooks = res.data.filter((book: Book) => book.userEmail === userEmail);
        setBooks(myBooks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books:', err);
        setLoading(false);
      });
  }, [userEmail, router]);

  // বই আপডেট হ্যান্ডলার
  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBook) return;

    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const author = (form.elements.namedItem('author') as HTMLInputElement).value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
    const image = (form.elements.namedItem('image') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
    const totalCopies = parseInt((form.elements.namedItem('totalCopies') as HTMLInputElement).value);

    const updatedData = { title, author, category, image, description, totalCopies };

    try {
      const res = await axios.patch(`http://localhost:5000/books/${selectedBook._id}`, updatedData);
      if (res.status === 200) {
        alert('Book updated successfully!');
        setBooks(books.map(b => b._id === selectedBook._id ? { ...b, ...updatedData } : b));
        setIsEditModalOpen(false);
        setSelectedBook(null);
      }
    } catch (err) {
      console.error('Failed to update book:', err);
      alert('Failed to update book.');
    }
  };

  // কাস্টম কনফার্মেশনের পর ডিলিট হ্যান্ডলার
  const handleDeleteConfirm = async () => {
    if (!bookToDeleteId) return;

    try {
      const res = await axios.delete(`http://localhost:5000/books/${bookToDeleteId}`);
      if (res.status === 200) {
        alert('Book deleted successfully!');
        setBooks(books.filter(b => b._id !== bookToDeleteId));
        setIsDeleteModalOpen(false);
        setBookToDeleteId(null);
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
      alert('Failed to delete book.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading your books...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Added Books</h1>
      {books.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t added any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between border border-gray-200">
              <div>
                <img src={book.image} alt={book.title} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md mb-2">
                    {book.category}
                  </span>
                  <h2 className="text-xl font-bold mb-1 truncate">{book.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
                  <p className="text-sm font-medium text-gray-500 mb-4">
                    Copies: <span className="text-green-600 font-bold">{book.totalCopies}</span>
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setBookToDeleteId(book._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Book: {selectedBook.title}</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Title</label>
                <input type="text" name="title" defaultValue={selectedBook.title} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                <input type="text" name="author" defaultValue={selectedBook.author} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" defaultValue={selectedBook.category} required className="w-full px-3 py-2 border rounded-md bg-white">
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="url" name="image" defaultValue={selectedBook.image} required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Copies</label>
                <input type="number" name="totalCopies" defaultValue={selectedBook.totalCopies} min="1" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <textarea name="description" defaultValue={selectedBook.description} rows={3} required className="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl text-center">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Are you sure?</h3>
            <p className="text-gray-600 text-sm mb-6">Do you really want to delete this book? This process cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}