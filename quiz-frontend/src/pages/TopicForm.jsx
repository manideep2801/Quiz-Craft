import { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";

export default function TopicForm({ topic, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (topic) {
        await axios.put(`/topics/${topic.id}`, { name, description });
      } else {
        await axios.post("/topics", { name, description });
      }

      // ✅ Refresh topics in parent
      onSuccess();

      // ✅ Reset fields after save
      setName("");
      setDescription("");
    } catch (err) {
      alert("Error saving topic");
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    onSuccess(); // clear edit state in parent
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6 items-center">
      <input
        type="text"
        placeholder="Topic Name"
        className="border rounded p-2 flex-1 bg-zinc-900 text-white border-zinc-700 focus:border-purple-500 outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        className="border rounded p-2 flex-1 bg-zinc-900 text-white border-zinc-700 focus:border-purple-500 outline-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          {topic ? "Update" : "Add"}
        </button>

        {/* ✅ Show Cancel button only in edit mode */}
        {topic && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
