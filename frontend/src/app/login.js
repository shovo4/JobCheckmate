import axios from 'axios';
import { useState } from 'react';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      // Assuming the response contains a message on successful login
      setLoginStatus('Login successful');
      console.log(response.data);
      // You can also redirect the user to another page or set the user's data in a global state/context
    } catch (error) {
      setLoginStatus('Login failed');
      console.error(error.response.data);
      // Handle error (e.g., show error message)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
}
