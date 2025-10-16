import { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";
import TopicForm from "./TopicForm";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // ✅ Reusable sorting function
  const sortTopics = (list) => {
    return [...list].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);
      if (isNaN(idA) || isNaN(idB)) {
        // fallback alphabetical sort
        return a.name.localeCompare(b.name);
      }
      return idA - idB;
    });
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/topics");
      console.log("Topics API Response:", res.data);
      setTopics(sortTopics(res.data));
    } catch (err) {
      console.error("Failed to fetch topics", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await axios.delete(`/topics/${id}`);
      setTopics((prev) => sortTopics(prev.filter((t) => t.id !== id)));
    } catch (err) {
      alert("Error deleting topic");
    }
  };

  const handleSuccess = async () => {
    setSelectedTopic(null);
    try {
      const res = await axios.get("/topics");
      setTopics(sortTopics(res.data));
    } catch (err) {
      console.error("Error refreshing topics after update", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Manage Topics</h1>

      <TopicForm topic={selectedTopic} onSuccess={handleSuccess} />

      <table className="w-full mt-6 border-collapse border border-zinc-700 text-left rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-zinc-800 text-white">
            <th className="p-3 border border-zinc-700">ID</th>
            <th className="p-3 border border-zinc-700">Name</th>
            <th className="p-3 border border-zinc-700">Description</th>
            <th className="p-3 border border-zinc-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t.id} className="border border-zinc-700 hover:bg-zinc-900">
              <td className="p-3">{t.id}</td>
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.description}</td>
              <td className="p-3">
                <div className="flex justify-center gap-3">
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md transition-colors"
                    onClick={() => setSelectedTopic(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md transition-colors"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {topics.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No topics found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
