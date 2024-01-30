'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Jobs() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [job,setJob] = useState([])
  const [jobs, setJobs] = useState([]); // This state will keep track of the jobs
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs when the component mounts
    async function fetchJobs() {
       
        setLoading(true);
        try {
          // Retrieve the token from local storage or cookies
         
          const token = localStorage.getItem('token'); // Replace 'authToken' with your token key
          console.log('tokenGet is',token);
  
          // Include the token in the Authorization header
          const response = await axios.get('http://localhost:8080/api/jobs', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setJobs(response.data.jobs);
        //   console.log(jobs)
        //   console.log(Array.isArray(jobs))
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
        const token = localStorage.getItem('token');
        console.log('token is',token);
        const response = await axios.post('http://localhost:8080/api/jobs', 
      { company, position }, // This is the payload (data)
      { // This is the Axios config object
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
      
          
          setCompany('');
          setPosition('');
        } catch (error) {
          console.error('Error submitting new job:', error);
          if (error.response) {
            // Handle specific error responses from the server
            console.error('Server responded with status code:', error.response.status);
          }
        }
      };
      


  console.log('Current jobs:', jobs);
  console.log('Number of jobs:', jobs.length);
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
        {jobs.length !== 0 ? (
  jobs.map((job, index) => (
    <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
      <div>
      <div className="p-2 rounded"> 
      <p className="text-lg font-bold">{job.position}</p>
      </div>
      <div className="bg-gray-200 p-2 rounded"> 
        <p className="text-lg font-bold">{job.company}</p>
      </div>
     
      </div>
      <div className="flex justify-center items-center">
        <p className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">{new Date(job.updatedAt).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        })}</p>
        <p className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full ml-2">{job.status}</p>
      </div>
      <div className="flex">
        <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
        <button className="text-red-600 hover:text-red-800">Delete</button>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-700">You have no jobs to display</p>
)}

        </div>
      </main>
    </div>
  );
}
