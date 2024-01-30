'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Jobs() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [jobs, setJobs] = useState([]); // This state will keep track of the jobs
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs when the component mounts
    async function fetchJobs() {
        setLoading(true);
        try {
          // Retrieve the token from local storage or cookies
          const token = localStorage.getItem('authToken'); // Replace 'authToken' with your token key
  
          // Include the token in the Authorization header
          const response = await axios.get('http://localhost:8080/api/jobs', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setJobs(response.data);
        } catch (err) {
          setError('Failed to fetch jobs. Please make sure you are logged in.');
          console.error('Error fetching jobs:', err);
        } finally {
          setLoading(false);
        }
      }
  
      fetchJobs();
    }, []);
  

  const handleJobSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const response = await fetch('/api/jobs', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
       
        },
        body: JSON.stringify({ company, position }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newJob = await response.json();
      setJobs([...jobs, newJob]); // Add the new job to the local state
      setCompany('');
      setPosition('');
    } catch (error) {
      console.error('Error submitting new job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Job Application Tracker</title>
      </Head>
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-lg font-bold">Hello</h1>
        <button className="text-blue-600 hover:text-blue-800">Logout</button>
      </header>
      <main className="container mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-8">New Job</h2>
          <form onSubmit={handleJobSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                Company
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="company"
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                Position
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="position"
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-700">You have no jobs to display</p>
          ) : (
       
            jobs.map((job, index) => (
              <div key={index} className="border-b last:border-b-0 py-4">
                <p className="text-lg font-bold">{job.company}</p>
                <p className="text-sm">{job.position}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
