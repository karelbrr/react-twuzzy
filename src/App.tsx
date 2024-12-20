import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { AppContent } from "./my-components/AppContent";

export default function App() {
  return (
    <BrowserRouter>
      

      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
