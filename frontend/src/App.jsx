// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import { getProfile } from './api/api';

const SOCKET_URL = 'http://localhost:5000';
let socket;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    const loadUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        // Token invalid or missing
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      loadUser();
    } else {
      setLoading(false);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    if (socket) socket.disconnect();
    socket = io(SOCKET_URL); // reconnect anonymously
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} socket={socket} /> : <Navigate to="/" />} 
            />
            {/* Add Skills & Projects pages similarly — let me know if you want their full code! */}
            <Route
              path="/skills"
              element={user ? <Skills /> : <Navigate to="/" />}
            />
            <Route
              path="/projects"
              element={user ? <Projects socket={socket} /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;