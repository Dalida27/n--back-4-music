'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [authUser] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      router.push('/');
    }
  }, [authUser, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (!res) throw new Error("Failed to sign in");

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      const userName = userDoc.exists() ? userDoc.data().name : '';

      sessionStorage.setItem('userName', userName);
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Sign In</h2>
        <p className='mb-6 text-xl'>Welcome back to <span className='text-red-500'>N!Music</span></p>
        {error && <p className="text-red-500">{error.message}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold rounded-md hover:from-red-500 hover:to-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <a className="mt-3" href="/sign-up">Don't have account? Create!</a>
      </form>
    </div>
  );
};

export default SignIn;
