import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Crown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Parrot } from "@/components/Parrot";
import { AmbienceToggle } from "@/components/AmbienceToggle";
import { MaskLines } from "@/components/fx";
import { useAuth } from "@/context/AuthContext";
import { useParrot } from "@/context/ParrotContext";
import { http } from "@/lib/api";
import { CaptainStats } from "@/sections/captain/CaptainStats";
import { NoticeDesk } from "@/sections/captain/NoticeDesk";
import { ComplaintsLog } from "@/sections/captain/ComplaintsLog";

export default function CaptainPage() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const { say } = useParrot();
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const load = useCallback(() => {
    http.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
    http.get("/notices").then((r) => setNotices(Array.isArray(r.data) ? r.data : [])).catch(() => setNotices([]));
    http.get("/admin/feedback").then((r) => setComplaints(Array.isArray(r.data) ? r.data : [])).catch(() => setComplaints([]));
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setTimeout(() => say(`Welcome to yer quarters, Captain ${user?.name?.split(" ").pop() || ""}. Crew ki shikayatein aur mast ki notices — sab yahin hai.`), 900);
    return () => clearTimeout(t);
  }, [say, user]);

  return (
    <div data-testid="captain-page" className="min-h-screen bg-[#071923] text-[#E9D4A5]">
      <header className="sticky top-0 z-50 bg-[#071923]/85 backdrop-blur-xl border-b border-[#D6A64F]/30">
        <div className="flex items-center justify-between gap-4 px-5 lg:px-10 h-16">
          <div className="flex items-center gap-4">
            <button data-testid="captain-back-btn" onClick={() => nav("/")} className="flex items-center gap-2 f-display text-[12px] font-bold tracking-[0.18em] uppercase text-[#E9D4A5] hover:text-[#F2C66D] transition-colors">
              <ArrowLeft size={16} /><span className="hidden sm:inline">Back to deck</span>
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <AmbienceToggle compact />
            <span className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full bg-[#D6A64F] text-[#071923] f-display text-[11px] font-bold tracking-[0.18em] uppercase"><Crown size={14} /> Captain</span>
            <button data-testid="captain-logout-btn" onClick={() => { logout(); nav("/login"); }} aria-label="Log out"
              className="w-10 h-10 grid place-items-center rounded-full border border-[#D6A64F]/45 text-[#F2C66D] hover:bg-[#174653] transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </header>

      <main data-shake className="px-5 sm:px-10 lg:px-16 pt-10 pb-32 lg:pt-14">
        <section className="relative mb-12 lg:mb-16">
          <motion.img src="/assets/ghost_ship.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover rounded-[28px] opacity-25"
            initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.5, ease: "easeOut" }} />
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#071923] via-[#071923]/80 to-transparent" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
            <p className="eyebrow mb-5">Captain-in-Chief · Private Quarters</p>
            <h1 className="f-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              <MaskLines lines={["Command the", "whole fleet"]} />
              <MaskLines lines={["from one desk."]} lineClass="gold-text" delay={0.3} />
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-[#E9D4A5]/85 leading-relaxed">Nail fresh notices to the mast, read what the crew mutters in the Mangrove, and keep count of every soul aboard.</p>
          </div>
        </section>

        <CaptainStats stats={stats} />

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 mt-10 lg:mt-14 items-start">
          <NoticeDesk notices={notices} onChange={load} />
          <ComplaintsLog items={complaints} />
        </div>
      </main>
      <Parrot />
    </div>
  );
}
