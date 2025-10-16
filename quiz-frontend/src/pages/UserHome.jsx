import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Plus, Minus, Check } from "lucide-react"; // ✅ for counter & checkmark icons

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]); // multiple topics
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [count, setCount] = useState(10); // ✅ minimum 10 questions
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get("/api/quiz/topics");
        console.log("Topics:", res.data);
        setTopics(res.data);
      } catch (err) {
        console.error("Failed to load topics:", err);
        toast.error("Failed to load topics");
      }
    };
    fetchTopics();
  }, []);

  // ✅ Toggle topic selection (multiple allowed)
  const handleSelect = (topic) => {
    const topicId = topic.id || topic.topicId;
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  // ✅ Increment & Decrement handlers
  const increment = () => setCount((prev) => Math.min(prev + 1, 50)); // Max 50
  const decrement = () => setCount((prev) => Math.max(prev - 1, 10)); // Min 10

  const startQuiz = () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    navigate(
      `/quiz?topics=${selectedTopics.join(
        ","
      )}&difficulty=${difficulty}&numQ=${count}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        Choose a <span className="text-primary">Quiz Topic</span>
      </h1>

      {/* 🧩 Topics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => {
          const topicId = topic.id || topic.topicId;
          const isSelected = selectedTopics.includes(topicId);

          return (
            <motion.div
              key={topicId || index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(topic)}
              className={`relative cursor-pointer p-6 rounded-xl border transition shadow-sm ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {/* ✅ Blue checkmark icon */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}

              <h2 className="text-xl font-semibold mb-2">
                {topic.name || topic.topicName}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {topic.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* 🧭 Difficulty & Question Count Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-6">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="MODERATE">Moderate</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        {/* ✅ Increment / Decrement Counter for Questions */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Number of Questions
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-semibold w-10 text-center">
              {count}
            </span>
            <button
              onClick={increment}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">(Min 10, Max 50)</p>
        </div>
      </div>

      {/* 🟢 Start Button */}
      <div className="text-center mt-8">
        <button
          onClick={startQuiz}
          className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:opacity-90"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
