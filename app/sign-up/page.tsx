'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch('https://avatar.iran.liara.run/public');
        if (!response.ok) {
          throw new Error('Failed to fetch profile pictures');
        }
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        setProfilePicture(data[randomIndex]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfilePicture();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res && res.user) {
        const db = getFirestore();
        await setDoc(doc(db, "users", res.user.uid), {
          name,
          profilePicture
        });
        sessionStorage.setItem('userName', name);
        sessionStorage.setItem('profilePicture', profilePicture);
        setEmail('');
        setPassword('');
        setName('');
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
        <p className='mb-6 text-xl'>Welcome to <span className='text-red-500'>N!Music</span></p>
        {error && <p className="text-red-500">{error.message}</p>}
        {fetchError && <p className="text-red-500">{fetchError}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2" htmlFor="name">
            Name
          </label>
          <input
            placeholder='Name...'
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
            Email
          </label>
          <input
            placeholder='Email...'
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
            placeholder='Password...'
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
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <a className='mt-3' href="/sign-in">Already have an account?</a>
      </form>
    </div>
  );
};

export default SignUp;
