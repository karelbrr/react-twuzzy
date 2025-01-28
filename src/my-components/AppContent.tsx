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
import { ProfileDetails } from "@/pages/ProfileDetails";
import { Content } from "../my-components/Content";
import NoChatSelected from "./NoChatSelected";


export const AppContent = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/news/:id" element={<NewsPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<NoChatSelected/>}/>
      <Route path="chat/:id" element={<Content/>}/>
      
    </Route>
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
            <SettingsBlocked />
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
    <Route
      path="/profile/:id"
      element={
        <ProtectedRoute>
          <ProfileDetails />
        </ProtectedRoute>
      }
    />
  </Routes>
);
