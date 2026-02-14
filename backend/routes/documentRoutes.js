import express from "express";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";
import { 
    deleteDocument,
     getDocument,
      getDocuments, 
       uploadDocument
     } from "../controller/documentController.js";

const router = express.Router();

// 🔒 Protect all document routes
router.use(protect);

// 📤 Upload document
router.post("/upload", upload.single("file"), uploadDocument);

// 📄 Get all documents
router.get("/", getDocuments); 

// 📄 Get single document by ID
router.get("/:id", getDocument);

// 🗑 Delete document
router.delete("/:id", deleteDocument);

// ✏️ Update document
// router.put("/:id", updateDocument);

export default router;
