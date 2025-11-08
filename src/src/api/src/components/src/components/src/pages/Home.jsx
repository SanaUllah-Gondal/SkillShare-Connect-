// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { isAuthenticated } from '../api/api';

export default function Home({ user }) {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() && !user) {
      // Force refresh if token exists but user not loaded
      window.location.reload();
    }
  }, [user]);

  const handleAuthSuccess = (userData) => {
    // Parent App will update user state
    if (userData) navigate('/profile');
  };

  if (user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome back, {user.username}!</h1>
        <p className="text-xl text-gray-600 mb-8">Let’s share your skills and find amazing projects.</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700"
          >
            Edit Your Profile
          </button>
          <button
            onClick={() => navigate('/skills')}
            className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg text-lg hover:bg-indigo-50"
          >
            Browse Skills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Connect Through <span className="text-indigo-600">Skills</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Showcase what you know. Find collaborators. Build amazing things together — all in one place.
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-indigo-600 text-white text-xl px-8 py-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Join SkillShare Connect — It's Free!
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎓', title: 'Learn & Share', desc: 'Teach others, get feedback, grow together.' },
            { icon: '🤝', title: 'Collaborate', desc: 'Find teammates for passion projects.' },
            { icon: '🚀', title: 'Build', desc: 'Turn ideas into reality with skilled peers.' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <AuthForm
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}