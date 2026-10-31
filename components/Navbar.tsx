"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>({
    name: "John Doe",
    email: "john@gmail.com",
    image: "https://i.ibb.co.com/1Z2X3Y4/avatar.png"
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const links = (
    <>
      <Link href="/" className={pathname === "/" ? "text-primary font-bold" : ""}>Home</Link>
      <Link href="/books" className={pathname === "/books" ? "text-primary font-bold" : ""}>All Books</Link>
      {user && (
        <>
          <Link href="/add-book" className={pathname === "/add-book" ? "text-primary font-bold" : ""}>Add Book</Link>
          <Link href="/my-books" className={pathname === "/my-books" ? "text-primary font-bold" : ""}>My Books</Link>
          <Link href="/my-borrows" className={pathname === "/my-borrows" ? "text-primary font-bold" : ""}>My Borrows</Link>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-12 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-2">
            {links}
          </ul>
        </div>
        <Link href="/" className="text-2xl font-black text-primary">BookNook</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6 font-medium">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-3">
        {user ? (
          <div className="relative">
            <img 
              src={user.image} 
              alt="User" 
              className="w-10 h-10 rounded-full cursor-pointer border border-primary object-cover"
              onClick={() => setDropdownOpen(!dropdownOpen)} 
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 shadow-xl rounded-box p-3 z-50 border">
                <p className="font-semibold text-sm mb-2">{user.name}</p>
                <Link href="/my-profile" className="block py-1 text-sm hover:text-primary">My Profile</Link>
                <button onClick={() => setUser(null)} className="w-full text-left py-1 text-sm text-red-500 font-medium">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-sm btn-outline btn-primary">Login</Link>
            <Link href="/register" className="btn btn-sm btn-primary">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}