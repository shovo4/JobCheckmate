// pages/signup.js
"use client"; // This is a client component 👈🏽
import axios from 'axios';
import { useState } from 'react';

export default function SignUp() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      console.log(response.data);
      // Redirect or show success message
    } catch (error) {
      console.error(error.response.data);
      // Show error message
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
