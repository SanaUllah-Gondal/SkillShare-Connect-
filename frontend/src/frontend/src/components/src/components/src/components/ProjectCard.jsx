import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
      <p className="text-gray-600 mt-2 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-500">Needs:</span>
        {project.neededSkills.map((skill, i) => (
          <span key={i} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
      <Link
        to={`/projects/${project._id}`}
        className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Join Project
      </Link>
    </div>
  );
}