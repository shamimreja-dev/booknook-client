
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handleProfileUpdate = async () => {
      await refetch();
      router.refresh();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [refetch, router]);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 transition-colors hover:text-primary ${
      isActive(href) ? "font-bold text-primary" : ""
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            router.replace("/login");
            router.refresh();
          },
          onError: (context) => {
            console.error("Logout failed:", context.error);
            setLoggingOut(false);
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const navigationLinks = (
    <>
      <li>
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>
      </li>

      <li>
        <Link href="/books" className={linkClass("/books")}>
          All Books
        </Link>
      </li>

      {user && (
        <>
          <li>
            <Link href="/add-book" className={linkClass("/add-book")}>
              Add Book
            </Link>
          </li>

          <li>
            <Link href="/my-books" className={linkClass("/my-books")}>
              My Books
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/my-borrows"
              className={linkClass("/dashboard/my-borrows")}
            >
              My Borrows
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-base-200 bg-base-100 shadow-md">
      <div className="navbar mx-auto max-w-7xl px-4 md:px-8">
        {/* Left: Logo and mobile menu */}
        <div className="navbar-start gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <Link
            href="/"
            className="text-xl font-black tracking-tight text-primary md:text-2xl"
          >
            📚 BookNook
          </Link>
        </div>

        {/* Center: Desktop navigation */}
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal items-center gap-1 px-1 font-medium">
            {navigationLinks}
          </ul>
        </nav>

        {/* Right: Authentication */}
        <div className="navbar-end gap-2">
          {isPending ? (
            <span className="loading loading-spinner loading-sm text-primary" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((previous) => !previous)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-base-200"
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={
                    user.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={user.name || "User"}
                  className="h-10 w-10 rounded-full border-2 border-primary object-cover"
                />

                <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                  {user.name || "My Account"}
                </span>

                <span className="text-xs">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-3 w-60 rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl">
                  <div className="mb-2 border-b border-base-200 pb-3">
                    <p className="font-semibold">
                      {user.name || "User"}
                    </p>
                    <p className="mt-1 break-all text-xs text-base-content/60">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/my-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm transition hover:bg-base-200 hover:text-primary"
                  >
                    👤 My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-error transition hover:bg-base-200 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-2" />
                        Logging out...
                      </>
                    ) : (
                      "↪ Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="btn btn-sm btn-outline btn-primary"
              >
                Login
              </Link>

              <Link href="/signup" className="btn btn-sm btn-primary">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-base-200 bg-base-100 px-4 py-3 lg:hidden">
          <ul className="menu w-full gap-1 rounded-box font-medium">
            {navigationLinks}
          </ul>
        </nav>
      )}
    </header>
  );
}
