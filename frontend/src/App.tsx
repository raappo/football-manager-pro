import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Contracts from './pages/Contracts';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('footypro_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem('footypro_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('footypro_user');
    setUser(null);
  };

  if (loading) return null; // Prevent flash of login screen

  return (
    <BrowserRouter>
      <Routes>
        {/* If no user, force them to the Login screen */}
        {!user ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          /* If user exists, show the app */
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<Dashboard />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="players" element={<Players />} />
            <Route path="matches" element={<Matches />} />
            <Route path="contracts" element={<Contracts />} />
            {/* Catch-all redirects back to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;