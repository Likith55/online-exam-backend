import { useEffect, useState } from "react";
import API from "../api";
import QuizForm from "./QuizForm";

export default function AdminDashboard({ onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const fetchQuizzes = async () => {
    const res = await API.get("/quizzes");
    setQuizzes(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await API.delete(`/quizzes/${id}`);
      fetchQuizzes();
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>🧑‍💼 Admin Panel</h2>
      <button onClick={onLogout}>Logout</button>
      <button onClick={() => { setEditingQuiz(null); setShowForm(true); }}>
        ➕ New Quiz
      </button>

      {showForm && (
        <QuizForm
          quiz={editingQuiz}
          onSuccess={() => {
            setShowForm(false);
            fetchQuizzes();
          }}
        />
      )}

      <h3>📚 Existing Quizzes</h3>
      {quizzes.length === 0 && <p>No quizzes found.</p>}
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="quiz-card">
          <h4>{quiz.title}</h4>
          <p>{quiz.description}</p>
          <button onClick={() => { setEditingQuiz(quiz); setShowForm(true); }}>✏️ Edit</button>
          <button onClick={() => handleDelete(quiz._id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}
