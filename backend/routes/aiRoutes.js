import express from "express";


import protect from "../middleware/auth.js";
import { chat, explainConcept, generateFlashcards, generateQuiz, generateSummary, getChatHistory } from "../controller/aiController.js";

const router = express.Router();

router.use(protect);

router.post("/generate-flashcards", generateFlashcards);
router.post("/generate-quiz", generateQuiz);
router.post("/generate-summary", generateSummary);
router.post("/chat", chat);
router.post("/explain-concept", explainConcept);
router.get("/chat-history/:documentId", getChatHistory);

export default router;
