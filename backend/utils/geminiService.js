// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const ai = new GoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// if (!process.env.GEMINI_API_KEY) {
//   console.error(
//     "FATAL ERROR: GEMINI_API_KEY is not set in the environment variables."
//   );
//   process.exit(1);
// }

// /**
//  * Generate flashcards from text
//  * @param {string} text - Document text
//  * @param {number} count - Number of flashcards to generate
//  * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
//  */
// export const generateFlashcards = async (text, count = 10) => {
//   const prompt = `Generate exactly ${count} educational flashcards from the following text.
// Format each flashcard as:
// Q: [clear, specific question]
// A: [concise, accurate answer]
// D: [difficulty level: easy, medium, or hard]

// Separate each flashcard with "---"

// Text:
// ${text.substring(0, 15000)}`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash",
//       contents: prompt,
//     });

//     const generatedText = response.text;

//     // Parse the response
//     const flashcards = [];
//     const cards = generatedText.split("---").filter((c) => c.trim());

//     for (const card of cards) {
//       const lines = card.trim().split("\n");
//       let question = "",
//         answer = "",
//         difficulty = "medium";

//       for (const line of lines) {
//         if (line.startsWith("Q:")) {
//           question = line.substring(2).trim();
//         } else if (line.startsWith("A:")) {
//           answer = line.substring(2).trim();
//         } else if (line.startsWith("D:")) {
//           const diff = line.substring(2).trim().toLowerCase();
//           if (["easy", "medium", "hard"].includes(diff)) {
//             difficulty = diff;
//           }
//         }
//       }

//       if (question && answer) {
//         flashcards.push({ question, answer, difficulty });
//       }
//     }

//     return flashcards.slice(0, count);
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to generate flashcards");
//   }
// };

// /**
//  * Generate quiz questions
//  * @param {string} text - Document text
//  * @param {number} numQuestions - Number of questions
//  * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
//  */
// export const generateQuiz = async (text, numQuestions = 5) => {
//   const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
// Format each question as:
// Q: [question]
// A: [option 1]
// B: [option 2]
// C: [option 3]
// D: [option 4]
// E: [correct option - exactly as written above]
// X: [brief explanation]
// D: [difficulty: easy, medium, or hard]

// Separate questions with "---"

// Text:
// ${text.substring(0, 15000)}`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt,
//     });

//     const generatedText = response.text;
//     const questions = [];
//     const questionBlocks = generatedText
//       .split("---")
//       .filter((q) => q.trim());

//     for (const block of questionBlocks) {
//       const lines = block.trim().split("\n");
//       let question = "",
//         options = [],
//         correctAnswer = "",
//         explanation = "",
//         difficulty = "medium";

//       for (const line of lines) {
//         const trimmed = line.trim();
//         if (trimmed.startsWith("Q:")) {
//           question = trimmed.substring(2).trim();
//         } else if (trimmed.match(/^[A-D]:/)) {
//           options.push(trimmed.substring(2).trim());
//         } else if (trimmed.startsWith("E:")) {
//           correctAnswer = trimmed.substring(2).trim();
//         } else if (trimmed.startsWith("X:")) {
//           explanation = trimmed.substring(2).trim();
//         } else if (trimmed.startsWith("D:")) {
//           const diff = trimmed.substring(2).trim().toLowerCase();
//           if (["easy", "medium", "hard"].includes(diff)) {
//             difficulty = diff;
//           }
//         }
//       }

//       if (question && options.length === 4 && correctAnswer) {
//         questions.push({
//           question,
//           options,
//           correctAnswer,
//           explanation,
//           difficulty,
//         });
//       }
//     }

//     return questions.slice(0, numQuestions);
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to generate quiz");
//   }
// };

// /**
//  * Generate document summary
//  * @param {string} text - Document text
//  * @returns {Promise<string>}
//  */
// export const generateSummary = async (text) => {
//   const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important details. Keep the summary clear and structured.

// Text:
// ${text.substring(0, 20000)}`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt,
//     });

//     return response.text;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to generate summary");
//   }
// };

// /**
//  * Chat with document context
//  * @param {string} question - User question
//  * @param {Array<Object>} chunks - Relevant document chunks
//  * @returns {Promise<string>}
//  */
// export const chatWithContext = async (question, chunks) => {
//   const context = chunks
//     .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
//     .join("\n\n");

//   console.log("Context:", context);

//   const prompt = `Based on the following context from a document, analyze the context and answer the user's question.
// If the answer is not in the context, say so.

// Context:
// ${context}

// Question: ${question}

// Answer:`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt,
//     });

//     return response.text;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to process chat request");
//   }
// };

// /**
//  * Explain a specific concept
//  * @param {string} concept - Concept to explain
//  * @param {string} context - Relevant context
//  * @returns {Promise<string>}
//  */
// export const explainConcept = async (concept, context) => {
//   const prompt = `Explain the concept of "${concept}" based on the following context.
// Provide a clear, educational explanation that's easy to understand.
// Include examples if relevant.

// Context:
// ${context.substring(0, 10000)}`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt,
//     });

//     const generatedText = response.text;
//     return generatedText;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to explain concept");
//   }
// };


import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/* ---------------------------------------------------
   ENV CHECK (NO GEMINI HIT HERE)
--------------------------------------------------- */
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ FATAL ERROR: GEMINI_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY loaded");

/* ---------------------------------------------------
   GEMINI CLIENT + MODEL (SINGLE INSTANCE)
--------------------------------------------------- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

/* ---------------------------------------------------
   GENERATE FLASHCARDS (CALLED ONLY VIA API)
--------------------------------------------------- */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.
Format each flashcard as:
Q: [clear, specific question]
A: [concise, accurate answer]
D: [difficulty level: easy, medium, or hard]

Separate each flashcard with "---"

Text:
${text.substring(0, 15000)}`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    const flashcards = [];
    const cards = generatedText.split("---").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");
      let question = "",
        answer = "",
        difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) question = line.substring(2).trim();
        else if (line.startsWith("A:")) answer = line.substring(2).trim();
        else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) difficulty = diff;
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Failed to generate flashcards");
  }
};

/* ---------------------------------------------------
   GENERATE QUIZ (CALLED ONLY VIA API)
--------------------------------------------------- */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
Format each question as:
Q: [question]
A: [option 1]
B: [option 2]
C: [option 3]
D: [option 4]
E: [correct option - exactly as written above]
X: [brief explanation]
D: [difficulty: easy, medium, or hard]

Separate questions with "---"

Text:
${text.substring(0, 15000)}`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    const questions = [];
    const blocks = generatedText.split("---").filter((b) => b.trim());

    for (const block of blocks) {
      const lines = block.trim().split("\n");
      let question = "",
        options = [],
        correctAnswer = "",
        explanation = "",
        difficulty = "medium";

      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith("Q:")) question = t.substring(2).trim();
        else if (/^[A-D]:/.test(t)) options.push(t.substring(2).trim());
        else if (t.startsWith("E:")) correctAnswer = t.substring(2).trim();
        else if (t.startsWith("X:")) explanation = t.substring(2).trim();
        else if (t.startsWith("D:")) {
          const diff = t.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) difficulty = diff;
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Failed to generate quiz");
  }
};

/* ---------------------------------------------------
   GENERATE SUMMARY (CALLED ONLY VIA API)
--------------------------------------------------- */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important details.

Text:
${text.substring(0, 20000)}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Failed to generate summary");
  }
};

/* ---------------------------------------------------
   CHAT WITH CONTEXT (CALLED ONLY VIA API)
--------------------------------------------------- */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `Based on the following context, answer the user's question.
If the answer is not present, say so.

Context:
${context}

Question: ${question}

Answer:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Failed to process chat request");
  }
};

/* ---------------------------------------------------
   EXPLAIN CONCEPT (CALLED ONLY VIA API)
--------------------------------------------------- */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context.
Provide a clear and easy explanation with examples if relevant.

Context:
${context.substring(0, 10000)}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    throw new Error("Failed to explain concept");
  }
};
