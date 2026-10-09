import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ParrotProvider } from "@/context/ParrotContext";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import CaptainPage from "@/pages/Captain";

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);
  return null;
}

function Splash() {
  return <div className="min-h-screen grid place-items-center bg-[#071923] f-display text-[#F2C66D] tracking-[0.3em]">HOISTING SAILS…</div>;
}

function Protected({ children, captainOnly = false }) {
  const { user } = useAuth();
  if (user === null) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  if (captainOnly && user.role !== "captain") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ParrotProvider>
          <SmoothScroll />
          <Toaster position="top-center" toastOptions={{ style: { background: "#0B202C", color: "#E9D4A5", border: "1px solid rgba(214,166,79,.45)", fontFamily: "Outfit, sans-serif" } }} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Protected><HomePage /></Protected>} />
            <Route path="/captain" element={<Protected captainOnly><CaptainPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ParrotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
