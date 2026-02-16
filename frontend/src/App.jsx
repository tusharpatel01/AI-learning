import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import QuizResultPage from "./pages/quizzes/QuizResultPage.jsx";
import QuizTakePage from "./pages/quizzes/QuizTakePage.jsx";
import FlashCardsPage from "./pages/flashcards/FlashCardsPage.jsx";
import DocumentDetailPage from "./pages/documents/DocumentDetailPage.jsx";
import DocumentListPage from "./pages/documents/DocumentListPage.jsx";
import FlashCardsListPage from "./pages/flashcards/FlashCardListPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
  const{isAuthenticated,loading}=useAuth();

  if (loading) {
    return (
      <div >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashCardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashCardsPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
