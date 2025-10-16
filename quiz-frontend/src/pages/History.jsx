import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Eye } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/quiz/history");
        console.log("History Data:", res.data);
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to load history:", err);
        toast.error("Failed to load quiz history");
      }
    };

    fetchHistory();
  }, []);

  // ✅ Handle "View Details" click
  const viewDetails = async (attemptId) => {
    try {
      const res = await api.get(`/api/quiz/result/${attemptId}`);
      console.log("Quiz Attempt Details:", res.data);

      // Navigate to result page with quiz details
      navigate("/quiz-result", { state: { result: res.data } });
    } catch (err) {
      console.error("Failed to load attempt details:", err);
      toast.error("Failed to load quiz details");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-center"
      >
        📊 Quiz <span className="text-primary">History</span>
      </motion.h1>

      {/* Chart Section */}
      {history.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Performance Overview
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={history.map((h) => ({
                topic: h.topicName,
                percentage: h.percentage,
                score: h.score,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="percentage"
                fill="#3b82f6"
                name="Score %"
                radius={[8, 8, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 5 }}
                name="Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <p className="text-center text-zinc-500">No quiz history available.</p>
      )}

      {/* Table Section */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3 text-left">Topic</th>
                <th className="p-3 text-left">Difficulty</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3 text-center">Percentage</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-zinc-300 dark:border-zinc-700 ${
                    idx % 2 === 0
                      ? "bg-zinc-50 dark:bg-zinc-900"
                      : "bg-white dark:bg-zinc-800"
                  }`}
                >
                  <td className="p-3 font-medium">{item.topicName}</td>
                  <td className="p-3">{item.difficultyLevel}</td>
                  <td className="p-3 text-center">
                    {item.score}/{item.totalQuestions}
                  </td>
                  <td className="p-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                    {item.percentage.toFixed(2)}%
                  </td>
                  <td className="p-3 text-center text-sm text-zinc-500">
                    {new Date(item.attemptedAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => viewDetails(item.attemptId)}
                      className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
