"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = { name: "John Doe", email: "john@gmail.com" };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/books/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data))
        .catch(() => {});
    }
  }, [id]);

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const borrowPayload = {
      bookId: book._id,
      bookTitle: book.title,
      bookImage: book.image,
      userEmail: user.email,
      userName: user.name,
      borrowDate: new Date().toLocaleDateString(),
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };

    try {
      const res = await fetch("http://localhost:5000/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowPayload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Book borrowed successfully!");
        setIsModalOpen(false);
        setBook({ ...book, totalCopies: book.totalCopies - 1 });
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to borrow book.");
    }
  };

  if (!book) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <img src={book.image} alt={book.title} className="w-full h-[400px] object-cover rounded-xl shadow-lg" />
      <div className="space-y-4">
        <span className="badge badge-primary">{book.category}</span>
        <h1 className="text-4xl font-bold">{book.title}</h1>
        <p className="text-lg font-medium text-gray-600">Author: {book.author}</p>
        <p className="text-gray-500">{book.description}</p>
        <p className="text-sm font-semibold">Added By: {book.userName} ({book.userEmail})</p>
        <p className="text-md font-bold">Available Copies: <span className="text-primary">{book.totalCopies}</span></p>

        {book.totalCopies > 0 ? (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary px-8">Borrow This Book</button>
        ) : (
          <button disabled className="btn btn-disabled px-8">Not Available</button>
        )}
      </div>

      {/* Borrow Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Borrowing: {book.title}</h3>
            <form onSubmit={handleBorrowSubmit} className="space-y-4">
              <div>
                <label className="label">User Name</label>
                <input type="text" value={user.name} readOnly className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label">User Email</label>
                <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Confirm Borrow</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}