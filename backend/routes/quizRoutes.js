import express from "express";

import protect from "../middleware/auth.js";
import { deleteQuiz, getQuizById, getQuizResults, getQuizzes, submitQuiz } from "../controller/quizController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/:documentId", getQuizzes);
router.get("/quiz/:id", getQuizById);
router.post("/:id/submit", submitQuiz);
router.get("/:id/results", getQuizResults);
router.delete("/:id", deleteQuiz);

export default router;
