import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-7xl font-black text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}