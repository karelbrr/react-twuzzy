import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import ProtectedRoute from "@/auth/ProtectedRoute";


export const AppContent = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage/>
        </ProtectedRoute>
      }
    />
  </Routes>
);
