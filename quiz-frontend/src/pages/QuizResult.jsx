import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";

export default function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;
  const user = JSON.parse(localStorage.getItem("qc_user"));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-lg">No result data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Go Home
        </button>
      </div>
    );
  }

  const data = [
    { name: "Correct", value: result.correctAnswers },
    { name: "Wrong", value: result.wrongAnswers },
  ];

  const COLORS = ["#4CAF50", "#F44336"];
  const reviews = result?.questionReviews || [];

  const handleSendEmail = async () => {
    if (!user?.email) {
      toast.error("User email not found!");
      return;
    }

    setSending(true);
    try {
      await toast.promise(
        api.post(
          `/api/quiz/send-quiz-result?email=${encodeURIComponent(user.email)}`,
          result
        ),
        {
          loading: "Sending quiz results to your email...",
          success: "✅ Quiz results sent successfully!",
          error: "❌ Failed to send quiz results.",
        }
      );

      // ✅ Update state after success
      setSent(true);
    } catch (err) {
      console.error("Error sending quiz result email:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Quiz Results
      </h1>

      {/* === SCORE SUMMARY === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Performance Summary</h2>
          <p className="text-lg">
            <strong>Score:</strong> {result.score}/{result.totalQuestions}
          </p>
          <p>
            <strong>Correct:</strong> {result.correctAnswers}
          </p>
          <p>
            <strong>Wrong:</strong> {result.wrongAnswers}
          </p>
          <p>
            <strong>Percentage:</strong> {result.percentage.toFixed(2)}%
          </p>
          <p>
            <strong>Difficulty:</strong> {result.difficultyLevel}
          </p>
        </div>

        {/* === PIE CHART === */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === QUESTION REVIEWS === */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Question Review</h2>
        {reviews && reviews.length > 0 ? (
          reviews.map((q, idx) => (
            <div
              key={q.questionId || idx}
              className="border border-zinc-300 dark:border-zinc-700 p-5 rounded-lg bg-white dark:bg-zinc-900 shadow-sm"
            >
              <p className="font-semibold mb-3">
                {idx + 1}. {q.questionText}
              </p>

              <ul className="space-y-2">
                {(q.options || []).map((opt) => {
                  const isCorrect = opt.isCorrect;
                  const isSelected = opt.wasSelected;

                  let colorClass =
                    "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800";
                  let label = null;

                  if (isSelected && isCorrect) {
                    colorClass =
                      "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300";
                    label = (
                      <span className="ml-2 text-green-600 font-semibold">
                        ✅ Your Choice (Correct)
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    colorClass =
                      "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300";
                    label = (
                      <span className="ml-2 text-red-600 font-semibold">
                        ❌ Your Choice (Wrong)
                      </span>
                    );
                  } else if (isCorrect) {
                    colorClass =
                      "bg-green-500/10 border-green-400 text-green-600 dark:text-green-300";
                    label = (
                      <span className="ml-2 text-green-500 font-semibold">
                        ✅ Correct Answer
                      </span>
                    );
                  }

                  return (
                    <li
                      key={opt.optionId}
                      className={`border p-2 rounded-lg transition ${colorClass}`}
                    >
                      {opt.optionText} {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-500">
            No question review data available.
          </p>
        )}
      </div>

      {/* === ACTION BUTTONS === */}
      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90"
        >
          Back to Home
        </button>

        {/* ✅ Send Email Button with Status */}
        <button
          onClick={handleSendEmail}
          disabled={sending || sent}
          className={`px-5 py-2 rounded-lg flex items-center justify-center gap-2 transition text-white ${
            sent
              ? "bg-green-500 cursor-not-allowed"
              : sending
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {sent ? (
            <>
              <MailCheck size={18} />
              Sent Successfully
            </>
          ) : sending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending...
            </>
          ) : (
            "Send Results to Email"
          )}
        </button>
      </div>
    </motion.div>
  );
}
