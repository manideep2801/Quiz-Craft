import { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";
import QuestionForm from "./QuestionForm";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch all topics for dropdown
  const fetchTopics = async () => {
    try {
      const res = await axios.get("/topics");
      const sortedTopics = [...res.data].sort((a, b) => a.id - b.id);
      setTopics(sortedTopics);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    }
  };

  // Fetch questions (all or by topic)
  const fetchQuestions = async (topicId = "") => {
    try {
      let res;
      if (topicId) {
        res = await axios.get(`/questions/topic/${topicId}`);
      } else {
        res = await axios.get("/questions");
      }

      // sort by ID ascending
      const sorted = [...res.data].sort((a, b) => a.id - b.id);
      setQuestions(sorted);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`/questions/${id}`);
      fetchQuestions(selectedTopic);
    } catch (err) {
      alert("Error deleting question");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Manage Questions</h1>

      {/* Filter dropdown */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            fetchQuestions(e.target.value);
          }}
          className="border border-zinc-700 bg-zinc-900 text-white p-2 rounded w-1/3"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      <QuestionForm
        question={selectedQuestion}
        topics={topics}
        onSuccess={() => {
          setSelectedQuestion(null);
          fetchQuestions(selectedTopic);
        }}
      />

      {/* Questions Table */}
      <table className="w-full mt-6 border-collapse border border-zinc-700 text-left rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-zinc-800 text-white">
            <th className="p-3 border border-zinc-700">ID</th>
            <th className="p-3 border border-zinc-700">Question</th>
            <th className="p-3 border border-zinc-700">Topic</th>
            <th className="p-3 border border-zinc-700">Difficulty</th>
            <th className="p-3 border border-zinc-700">Options</th>
            <th className="p-3 border border-zinc-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border border-zinc-700 hover:bg-zinc-900">
              <td className="p-3">{q.id}</td>
              <td className="p-3">{q.questionText}</td>
              <td className="p-3">{q.topicName || "—"}</td>
              <td className="p-3">{q.difficultyLevel}</td>
              <td className="p-3">
                <ul className="list-disc pl-4">
                  {q.options?.map((opt) => (
                    <li
                      key={opt.id}
                      className={opt.isCorrect ? "text-green-400" : "text-gray-400"}
                    >
                      {opt.optionText}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-3">
                <div className="flex justify-center gap-3">
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md transition-colors"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md transition-colors"
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {questions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No questions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
