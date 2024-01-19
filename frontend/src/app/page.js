"use client"; // This is a client component 👈🏽
import Image from "next/image";
import styles from "./page.module.css";
import SignUp from './signup'; // Make sure this path is correct
import Login from './login'; // Import Login component
import Dashboard from './dashboard'; // Import Dashboard component
import { useState } from 'react'; // Import useState

export default function Home() {
  const [showLogin, setShowLogin] = useState(false); // State to toggle login component
  const [showDashboard, setShowDashboard] = useState(false); // State to toggle dashboard component

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowDashboard(false); // Hide dashboard when showing login
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    setShowLogin(false); // Hide login when showing dashboard
  };

  return (
    <main className={styles.main}>
      {/* ... existing content ... */}

      <div className={styles.container}>
        <SignUp />

        <button onClick={toggleLogin} className={styles.toggleButton}>
          {showLogin ? 'Hide Login' : 'Show Login'}
        </button>
        {showLogin && <Login />} {/* Conditionally render Login component */}

        <button onClick={toggleDashboard} className={styles.toggleButton}>
          {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
        </button>
        {showDashboard && <Dashboard />} {/* Conditionally render Dashboard component */}
      </div>
    </main>
  );
}
