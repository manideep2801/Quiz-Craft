import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/UserHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";
import QuizPlay from "./pages/QuizPlay";
import QuizResult from "./pages/QuizResult";
import ChangePassword from "./pages/ChangePassword";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import TopicsPage from "./pages/TopicsPage";
import QuestionsPage from "./pages/QuestionsPage";
import VerifyEmail from "./pages/VerifyEmail";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/history" element={<ProtectedRoute> {" "} <History />{" "} </ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute> <QuizPlay /> </ProtectedRoute>} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/change-password" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
          <Route path="/admin-home" element={<ProtectedRoute> <AdminHome /> </ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute> <AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-topics" element={<ProtectedRoute> <TopicsPage /></ProtectedRoute>} />
          <Route path="/admin-questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </div>
  );
}
