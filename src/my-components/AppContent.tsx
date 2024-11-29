import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { FirstLoginPage } from "@/pages/FirstLoginPage";
import { NewsPage } from "@/pages/NewsPage";
import { ProfileEdit } from "@/pages/ProfileEdit";
import { SettingsAccount } from "./SettingsAccount";
import { SettingsProfile } from "./SettingsProfile";
import { SettingsBlocked } from "./SettingsBlocked";
import { Toaster } from "@/components/ui/toaster";

export const AppContent = () => (
  <Routes>
    
    <Route path="/login" element={<LoginPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Toaster/>
          <HomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <ProfileEdit />
        </ProtectedRoute>
      }
    >
      <Route
        path="account"
        element={
          <ProtectedRoute>
            <SettingsAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <SettingsProfile />
          </ProtectedRoute>
        }
      />
       <Route
        path="blocked"
        element={
          <ProtectedRoute>
            <SettingsBlocked/>
          </ProtectedRoute>
        }
      />
    </Route>
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
