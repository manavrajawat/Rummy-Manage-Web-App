'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { SyntheticEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase/firebase';


const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  
  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Initialize Firebase auth
    const auth = getAuth(app);


    try {
      // Sign in with email and password
      
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the dashboard on successful login
      await router.push('/rummy/dashboard');

      // Optionally, you can add a toast notification for successful login
      toast.success('Login successful!');
    } catch (error) {
      // Log the full error object to the console
      console.error('Authentication failed', error);

      // Display error using toast
      toast.error('Authentication failed. Please check your credentials.');
    }

  };




  return (
    <div className="mt-10 mx-auto w-full max-w-sm p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-1 border-gray-400 outline-none focus:border-blue-600 py-2 text-gray-900 placeholder:text-gray-400 pl-4 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-1 border-gray-400 outline-none focus:border-blue-600 py-2 text-gray-900 placeholder:text-gray-400 pl-4 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in

          </button>

        </div>
      </form>
    </div>
  );
}

export default Page;
