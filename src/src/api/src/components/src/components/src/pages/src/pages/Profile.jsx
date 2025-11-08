// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/api';
import ChatWidget from '../components/ChatWidget';
import SkillTag from '../components/SkillTag';

export default function Profile({ user, socket }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({ bio: data.bio || '', skills: data.skills || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-indigo-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.username}</h1>
              <p className="opacity-90">{profile?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                  placeholder="Tell others about your expertise..."
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. React, Python, UI/UX"
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-indigo-600 text-white px-4 rounded-r-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-indigo-600">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({ bio: profile?.bio || '', skills: profile?.skills || [] });
                  }}
                  className="bg-gray-200 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="mt-2 text-gray-600">
                  {formData.bio || <span className="text-gray-400 italic">No bio yet.</span>}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
                {formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => (
                      <SkillTag key={i} skill={skill} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Chat — e.g., for "General Skill Exchange" */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Skill Exchange Chat</h2>
        <ChatWidget 
          socket={socket} 
          roomId="general-skill-chat" 
          currentUser={{ id: user.id, username: user.username }}
        />
      </div>
    </div>
  );
}