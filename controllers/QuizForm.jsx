import { useState } from "react";
import API from "../api";

export default function QuizForm({ quiz, onSuccess }) {
  const [title, setTitle] = useState(quiz ? quiz.title : "");
  const [description, setDescription] = useState(quiz ? quiz.description : "");
  const [questions, setQuestions] = useState(quiz ? quiz.questions : [
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (quiz) {
        await API.put(`/quizzes/${quiz._id}`, { title, description, questions });
      } else {
        await API.post("/quizzes", { title, description, questions });
      }
      alert("✅ Quiz saved successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save quiz. Check console for details.");
    }
  };

  return (
    <div className="quiz-form">
      <h3>{quiz ? "✏️ Edit Quiz" : "➕ Create New Quiz"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Quiz Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {questions.map((q, qi) => (
          <div key={qi} className="question-block">
            <p><b>Question {qi + 1}</b></p>
            <input
              type="text"
              placeholder="Question Text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qi, "questionText", e.target.value)}
              required
            />
            {q.options.map((opt, oi) => (
              <input
                key={oi}
                type="text"
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
                required
              />
            ))}
            <label>
              Correct Option (0–3):
              <input
                type="number"
                min="0"
                max="3"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(qi, "correctAnswer", parseInt(e.target.value))
                }
              />
            </label>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>➕ Add Question</button>
        <button type="submit">{quiz ? "Update Quiz" : "Create Quiz"}</button>
      </form>
    </div>
  );
}
