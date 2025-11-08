// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center">
          💡 SkillShare Connect
        </Link>

        <nav>
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/skills" className="text-gray-600 hover:text-indigo-600 font-medium">
                Skills
              </Link>
              <Link to="/projects" className="text-gray-600 hover:text-indigo-600 font-medium">
                Projects
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium">
                {user.username}
              </Link>
              <button
                onClick={onLogout}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-lg font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}