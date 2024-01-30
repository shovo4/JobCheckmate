'use client'
import axios from 'axios';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            email,
            password,
        });
        const data = response.data;
        // Handle response data (e.g., save JWT, redirect user, etc.)
        console.log(data);
        router.push('/job')
    } catch (error) {
        // Handle errors (e.g., show error message to the user)
        console.error('Error logging in:', error);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Login</title>
      </Head>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
            <a href="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Not a member yet? Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
