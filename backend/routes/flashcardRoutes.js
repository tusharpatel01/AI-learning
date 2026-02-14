import express from "express";


import protect from "../middleware/auth.js";
import { 
    deleteFlashcardSet,
     getAllFlashcardSets,
      getFlashcards,
       reviewFlashcard,
        toggleStarFlashcard
     } from "../controller/flashcardController.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllFlashcardSets);
router.get("/:documentId", getFlashcards);
router.post("/:cardId/review", reviewFlashcard);
router.put("/:cardId/star", toggleStarFlashcard);
router.delete("/:id", deleteFlashcardSet);

export default router;
