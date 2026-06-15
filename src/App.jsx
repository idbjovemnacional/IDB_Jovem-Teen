import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
}