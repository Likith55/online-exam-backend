import express from "express";
import { submitQuiz, getUserResults, getResultById } from "../controllers/resultController.js";

const router = express.Router();

// Student submits quiz
router.post("/submit", submitQuiz);

// Get all results of a student
router.get("/user/:userId", getUserResults);

// Get one result by ID
router.get("/:id", getResultById);

export default router;
