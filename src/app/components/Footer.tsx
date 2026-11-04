
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaBookOpen,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <FaBookOpen className="text-3xl text-primary" />
            <span className="text-2xl font-black text-primary">
              BookNook
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 opacity-80">
            Your small online library. Discover, add, borrow, and return
            your favorite books easily. Make reading a part of your life.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Quick Links</h3>
          <ul className="space-y-3 text-sm opacity-80">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-primary">
                All Books
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-primary">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-primary">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Contact Us</h3>

          <ul className="space-y-4 text-sm opacity-80">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary" />
              <a href="mailto:support@booknook.com" className="hover:text-primary">
                shamim.reja.dev@gmail.com
              </a>
            </li>

            <li className="flex items-center gap-3">
              <FaPhone className="text-primary" />
              <a href="tel:+8801234567890" className="hover:text-primary">
                +880 1306618232
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Follow Us</h3>

          <p className="mb-4 text-sm opacity-80">
            Stay connected with BookNook.
          </p>

          <div className="flex gap-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition hover:-translate-y-1 hover:text-primary"
            >
              <FaFacebook />
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="transition hover:-translate-y-1 hover:text-primary"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition hover:-translate-y-1 hover:text-primary"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-4 py-5 text-center">
        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </p>
        <p className="mt-1 text-xs opacity-50">
          Made with ❤️ for book lovers.
        </p>
      </div>
    </footer>
  );
}
