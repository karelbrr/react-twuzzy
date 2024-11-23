import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { FirstLoginPage } from "@/pages/FirstLoginPage";
import { NewsPage } from "@/pages/NewsPage";

export const AppContent = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/first_login"
      element={
        <ProtectedRoute>
          <FirstLoginPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);
