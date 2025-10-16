import { useEffect, useState } from "react";
import axios from "../lib/axiosInstance";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function QuestionForm({ question, topics, onSuccess }) {
  const [questionText, setQuestionText] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("BEGINNER");
  const [options, setOptions] = useState([{ optionText: "", isCorrect: false }]);
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    if (question) {
      setQuestionText(question.questionText);

      // ✅ Ensure we map topicName → topicId properly and store as a number
      const foundTopic = topics.find((t) => t.name === question.topicName);
      setTopicId(foundTopic ? Number(foundTopic.id) : "");

      setDifficultyLevel(question.difficultyLevel);
      setOptions(
        question.options?.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })) || [{ optionText: "", isCorrect: false }]
      );
    } else {
      resetForm();
    }
  }, [question, topics]);

  const resetForm = () => {
    setQuestionText("");
    setTopicId("");
    setDifficultyLevel("BEGINNER");
    setOptions([{ optionText: "", isCorrect: false }]);
    setShowOptions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (options.filter((opt) => opt.isCorrect).length !== 1) {
      alert("Please mark exactly one option as correct.");
      return;
    }

    // ✅ Ensure topicId is number, not string
    const payload = {
      questionText,
      topicId: Number(topicId),
      difficultyLevel,
      options: options.map((o) => ({
        optionText: o.optionText,
        isCorrect: o.isCorrect,
      })),
    };

    try {
      if (question) {
        await axios.put(`/questions/${question.id}`, payload);
      } else {
        await axios.post("/questions", payload);
      }

      onSuccess();
      resetForm();
    } catch (err) {
      console.error("❌ Error saving question:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving question");
    }
  };

  const handleCancel = () => {
    resetForm();
    onSuccess();
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;

    if (field === "isCorrect" && value) {
      updated.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, { optionText: "", isCorrect: false }]);
  const removeOption = (index) => {
    if (options.length > 1) setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-6 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {question ? "Edit Question" : "Add New Question"}
        </h2>
        <button
          type="button"
          onClick={() => setShowOptions((prev) => !prev)}
          className="flex items-center text-sm text-gray-300 hover:text-white transition"
        >
          {showOptions ? (
            <>
              Hide Options <ChevronUp className="ml-1" size={16} />
            </>
          ) : (
            <>
              Show Options <ChevronDown className="ml-1" size={16} />
            </>
          )}
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          className="border border-zinc-700 bg-zinc-800 text-white rounded p-2 flex-1"
          value={topicId}
          onChange={(e) => setTopicId(Number(e.target.value))} // ✅ convert to number
          required
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        <select
          className="border border-zinc-700 bg-zinc-800 text-white rounded p-2"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          required
        >
          <option value="BEGINNER">Beginner</option>
          <option value="MODERATE">Moderate</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Enter Question Text"
        className="border border-zinc-700 bg-zinc-800 text-white rounded p-2 w-full mb-4"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        required
      />

      {showOptions && (
        <div className="mb-4 animate-fadeIn">
          <h3 className="text-white mb-2">Options</h3>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-3 mb-2 bg-zinc-800 p-2 rounded">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="border border-zinc-700 bg-zinc-900 text-white rounded p-2 flex-1"
                value={opt.optionText}
                onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                required
              />
              <label className="flex items-center text-sm text-gray-300 gap-1">
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={(e) =>
                    handleOptionChange(index, "isCorrect", e.target.checked)
                  }
                />
                Correct
              </label>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded transition-colors text-sm mt-2"
          >
            + Add Option
          </button>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          {question ? "Update" : "Add Question"}
        </button>
        {question && (
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
