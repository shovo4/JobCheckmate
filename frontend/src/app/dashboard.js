import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        // Retrieve the token from local storage or cookies
        const token = localStorage.getItem('authToken'); // Replace 'authToken' with your token key

        // Include the token in the Authorization header
        const response = await axios.get('http://localhost:5000/api/jobs', {
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

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Job Dashboard</h1>
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            {job.company} - {job.position}
          </li>
        ))}
      </ul>
    </div>
  );
}
