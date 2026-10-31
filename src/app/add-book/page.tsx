"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const user = { name: "John Doe", email: "john@gmail.com" };

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const author = (form.elements.namedItem("author") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value;
    const totalCopies = (form.elements.namedItem("totalCopies") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    const bookData = {
      title,
      author,
      category,
      image,
      totalCopies: parseInt(totalCopies),
      description,
      userName: user.name,
      userEmail: user.email,
    };

    try {
      const res = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (res.ok) {
        toast.success("Book added successfully!");
        form.reset();
      } else {
        toast.error("Failed to add book.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-base-100 shadow-xl rounded-2xl border">
      <h2 className="text-3xl font-bold mb-6 text-center">Add a New Book</h2>
      <form onSubmit={handleAddBook} className="space-y-4">
        <div>
          <label className="label font-medium">Book Title</label>
          <input type="text" name="title" required className="input input-bordered w-full" placeholder="Enter book title" />
        </div>
        <div>
          <label className="label font-medium">Author Name</label>
          <input type="text" name="author" required className="input input-bordered w-full" placeholder="Author name" />
        </div>
        <div>
          <label className="label font-medium">Category</label>
          <select name="category" className="select select-bordered w-full">
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Kids">Kids</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="label font-medium">Book Image URL</label>
          <input type="url" name="image" required className="input input-bordered w-full" placeholder="Image URL" />
        </div>
        <div>
          <label className="label font-medium">Total Copies</label>
          <input type="number" name="totalCopies" required min="1" defaultValue="1" className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label font-medium">Short Description</label>
          <textarea name="description" required className="textarea textarea-bordered w-full h-24" placeholder="Book description..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label font-medium">User Name (Read-only)</label>
            <input type="text" value={user.name} readOnly className="input input-disabled w-full" />
          </div>
          <div>
            <label className="label font-medium">User Email (Read-only)</label>
            <input type="email" value={user.email} readOnly className="input input-disabled w-full" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}