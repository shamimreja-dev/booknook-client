'use client';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client'; // BetterAuth client import

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // ইমেইল ও পাসওয়ার্ড দিয়ে লগইন হ্যান্ডলার
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const userInfo = { email, password };

    try {
      const res = await axios.post('http://localhost:5000/jwt', userInfo);
      if (res.data.token) {
        localStorage.setItem('access-token', res.data.token);
        localStorage.setItem('user-email', email);

        // ডেটাবেজের users কালেকশনে সেভ করার রিকোয়েস্ট
        await axios.post('http://localhost:5000/users', {
          email: email,
          name: email.split('@')[0],
          createdAt: new Date()
        });

        alert('Login successful!');
        router.push('/');
      }
    } catch (_err) {
      setError('Invalid email or password.');
    }
  };

  // BetterAuth দিয়ে Google Login হ্যান্ডলার
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // লগইন সফল হওয়ার পর কোথায় যাবে
      });
    } catch (err) {
      console.error(err);
      setError('Google login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to BookNook</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-2 flex items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}