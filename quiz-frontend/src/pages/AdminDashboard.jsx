import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Admin Dashboard 👋</h1>
      <p className="text-lg text-gray-400">
        Choose a section to manage:
      </p>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/admin-topics")}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Manage Topics
        </button>
        <button
          onClick={() => navigate("/admin-questions")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Manage Questions
        </button>
      </div>
    </div>
  );
}
