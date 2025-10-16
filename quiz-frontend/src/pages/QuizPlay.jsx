import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { motion } from "framer-motion";

export default function QuizPlay() {
  const [searchParams] = useSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // ✅ Multiple topic support
  const topicsParam = searchParams.get("topics"); // example: "1,2,3"
  const difficulty = searchParams.get("difficulty");
  const numQ = searchParams.get("numQ");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // ✅ Parse multiple topics correctly
        const topicIds = topicsParam
          ? topicsParam.split(",").map((id) => Number(id.trim()))
          : [];

        if (topicIds.length === 0) {
          toast.error("No topics selected!");
          return;
        }

        const res = await api.post("/api/quiz/generate", {
          topicIds,
          difficultyLevel: difficulty,
          numberOfQuestions: Number(numQ),
        });

        console.log("QuizResponse:", res.data);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load questions:", err);
        toast.error(
          err.response?.data?.message || "Failed to load quiz questions"
        );
      }
    };

    fetchQuestions();
  }, [topicsParam, difficulty, numQ]);

  if (!quiz) {
    return <div className="text-center py-10 text-lg">Loading quiz...</div>;
  }

  const question = quiz.questions[current];

  const handleAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = async () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
    } else {
      const payload = {
        quizId: quiz.quizId,
        answers: quiz.questions.map((q) => ({
          questionId: Number(q.questionId),
          selectedOptionId: answers[q.questionId]
            ? Number(answers[q.questionId])
            : null,
        })),
      };

      console.log("Submitting payload:", payload);

      const unanswered = payload.answers.filter(
        (a) => a.selectedOptionId === null
      );
      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting!");
        return;
      }

      try {
        const res = await api.post("/api/quiz/submit", payload);
        console.log("Quiz submitted successfully:", res.data);
        navigate("/quiz-result", { state: { result: res.data } });
      } catch (err) {
        console.error("Failed to submit quiz:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Quiz submission failed!");
      }
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);
  };

  const progress = ((current + 1) / quiz.totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!completed ? (
        <>
          {/* 🧭 Header Section */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {quiz.topicNames?.join(", ")} Quiz
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Difficulty: {quiz.difficultyLevel}
            </span>
          </div>

          {/* 🟦 Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              <span>
                Question {current + 1} of {quiz.totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* 🧩 Question Card */}
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow"
          >
            <h3 className="text-lg font-semibold mb-4">
              {current + 1}.{" "}
              {question.questionTitle ||
                question.questionText ||
                question.question}
            </h3>

            <div className="space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option.optionId}
                  onClick={() =>
                    handleAnswer(question.questionId, option.optionId)
                  }
                  className={`w-full text-left border rounded-lg p-3 transition ${
                    answers[question.questionId] === option.optionId
                      ? "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.optionText}
                </button>
              ))}
            </div>

            {/* 🧭 Navigation Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              {/* 🟣 Previous Button */}
              <button
                onClick={() => {
                  if (current > 0) setCurrent((prev) => prev - 1);
                }}
                disabled={current === 0}
                className={`px-5 py-2 rounded-lg font-medium text-white transition 
                  ${
                    current === 0
                      ? "bg-primary opacity-50 cursor-not-allowed"
                      : "bg-primary hover:opacity-90"
                  }`}
              >
                Previous
              </button>

              {/* 🟢 Next / Finish Button */}
              <button
                onClick={handleNext}
                className={`px-5 py-2 rounded-lg font-medium text-white transition 
                  ${
                    current + 1 === quiz.totalQuestions
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:opacity-90"
                  }`}
              >
                {current + 1 === quiz.totalQuestions ? "Finish" : "Next"}
              </button>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow"
        >
          <h2 className="text-2xl font-bold">Quiz Completed 🎉</h2>
          <p className="text-lg">
            Your Score:{" "}
            <span className="text-primary font-bold">
              {score}/{quiz.totalQuestions}
            </span>
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="px-5 py-2 rounded-lg border dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
