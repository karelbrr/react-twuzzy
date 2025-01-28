import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { AppContent } from "./my-components/AppContent";
import { Toaster } from "./components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
export default function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Toaster />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}
