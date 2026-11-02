import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X Logo requirement

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-neutral text-neutral-content rounded">
      <aside>
        <h2 className="text-3xl font-bold text-primary">BookNook</h2>
        <p className="font-semibold">Your small online library. Add, Borrow, and Return books easily.</p>
        <p>Contact: support@booknook.com | +880 1234 567890</p>
        <div className="flex gap-4 mt-4 text-2xl">
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaXTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
        </div>
      </aside>
      <div className="my-4">
        <p>Copyright © 2026 - All right reserved by BookNook Ltd.</p>
      </div>
    </footer>
  );
}