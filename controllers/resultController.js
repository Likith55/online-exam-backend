import Result from "../models/resultModel.js";
import Quiz from "../models/quizModel.js";

// Submit quiz and calculate result
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let correctCount = 0;

    // Compare answers
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save result
    const result = await Result.create({
      user: userId,
      quiz: quizId,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      submittedAnswers: quiz.questions.map((q, index) => ({
        questionId: q._id,
        selectedOption: answers[index]
      }))
    });

    res.status(201).json({
      message: "Quiz submitted successfully!",
      score,
      correctAnswers: correctCount,
      totalQuestions,
      resultId: result._id
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error.message);
    res.status(500).json({ message: "Server error during quiz submission" });
  }
};

// Get results for a user
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.params.userId })
      .populate("quiz", "title description");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
};

// Get one result by ID
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("quiz", "title")
      .populate("user", "name email");
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching result" });
  }
};
