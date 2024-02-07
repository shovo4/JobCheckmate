
'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Jobs() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [job,setJob] = useState([])
  const [jobs, setJobs] = useState([]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditingJob, setCurrentEditingJob] = useState(null);
  

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
      
       console.log("r")
          const newJob = response.data.job;
         setJobs(currentJobs => [...currentJobs, newJob]); // Append new job to the current list

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

    const handleDelete = async (jobId) => {
        // Display confirmation dialog
        const isConfirmed = window.confirm('Are you sure you want to delete this job?');
      
        // Proceed only if the user confirmed
        if (isConfirmed) {
          try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/jobs/${jobId}`;
      
            await axios.delete(url, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            // Update state to reflect the deleted job
            setJobs(currentJobs => currentJobs.filter(job => job._id !== jobId));
      
            // Set a success message
            setDeleteMessage('Job deleted successfully.');
      
            // Optionally, clear the message after a few seconds
            setTimeout(() => setDeleteMessage(''), 500);
          } catch (error) {
            console.error('Error deleting job:', error);
            if (error.response) {
              console.error('Server responded with status code:', error.response.status);
            }
            // Set an error message if needed
            setDeleteMessage('Failed to delete the job.');
          }
        } else {
          // User canceled the action, you can optionally handle this case
          console.log('Job deletion canceled by the user.');
        }
      };

      const handleEditClick = (job) => {
        setCurrentEditingJob(job);
        setIsEditModalVisible(true);
      };

      const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!currentEditingJob) return;
        const updatedData = {
            company: currentEditingJob.company,
            position: currentEditingJob.position,
            status: currentEditingJob.status,
          };
        
          console.log('Sending update data:', updatedData); 
        try {
          const token = localStorage.getItem('token');
          const response = await axios.patch(`http://localhost:8080/api/jobs/${currentEditingJob._id}`, currentEditingJob, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      
          // Update the jobs list with the updated job
          setJobs(jobs.map(job => job._id === currentEditingJob._id ? response.data.job : job));
          setIsEditModalVisible(false); // Close the modal
          setCurrentEditingJob(null); // Reset current editing job
        } catch (error) {
            console.error('Error updating job:', error);
            if (error.response) {
              console.error('Server responded with status code:', error.response.status);
              console.error('Error details:', error.response.data); // Log more detailed error info
            }
          }
      };
      
      
      
      
      
      


//   console.log('Current jobs:', jobs);
//   console.log('Number of jobs:', jobs.length);
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
        {
            isEditModalVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <h2 className="text-2xl font-bold text-center mb-8">Edit Job</h2>
                    <form onSubmit={handleEditSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-company">
                        Company
                        </label>
                        <input
                        className="shadow appearance-none border hover:border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="edit-company"
                        type="text"
                        placeholder="Company"
                        value={currentEditingJob?.company || ''}
                        onChange={(e) => setCurrentEditingJob({ ...currentEditingJob, company: e.target.value })}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-position">
                        Position
                        </label>
                        <input
                        className="shadow appearance-none border hover:border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="edit-position"
                        type="text"
                        placeholder="Position"
                        value={currentEditingJob?.position || ''}
                        onChange={(e) => setCurrentEditingJob({ ...currentEditingJob, position: e.target.value })}
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="edit-status" className="block text-gray-700 text-sm font-bold mb-2">
                            Status
                        </label>
                       
                        <div className="relative "> 
                            <select
                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                id="edit-status"
                                value={currentEditingJob?.status || ''}
                                onChange={(e) => setCurrentEditingJob({ ...currentEditingJob, status: e.target.value })}
                            >
                                <option disabled value="">Select a status</option>
                                <option value="interview">Interview</option>
                                <option value="declined">Declined</option>
                                <option value="pending">Pending</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-2 right-0 flex items-center px-2 text-blue-700 hover:text-red-300">
                                <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>

                    </div>


                    <div className="flex justify-center">
                        <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        >
                        Save Changes
                        </button>
                        <button
                        onClick={() => setIsEditModalVisible(false)}
                        className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            )
        }


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
        {deleteMessage && (
      <div className="text-center my-4 text-red-500">
        {deleteMessage}
      </div>
    )}
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
                   <p className={`text-xs px-2 py-1 rounded-full ml-2 ${
                        job.status === 'pending' ? 'bg-yellow-200 text-yellow-700' :
                        job.status === 'declined' ? 'bg-red-200 text-red-700' :
                        job.status === 'interview' ? 'bg-green-200 text-green-700' :
                        '' }`}>{job.status}</p>
                </div>
                <div className="flex">
                    <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => handleEditClick(job)}>Edit</button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(job._id)}>Delete</button>
                    
                </div>
                </div>
            ))
            ) : (
            <p className="text-center text-gray-700">You have no jobs to display</p>
            )
        }

        </div>
      </main>
    </div>
  );
}
