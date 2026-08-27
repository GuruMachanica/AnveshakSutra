import React from 'react';
import { ShieldCheck, HelpCircle, Terminal } from 'lucide-react';
import { CyberHologramCanvas } from '../CyberHologramCanvas';

interface LandingHeroProps {
  onOpenSafety: () => void;
  onOpenHowItWorks: () => void;
  onOpenCli: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenSafety,
  onOpenHowItWorks,
  onOpenCli,
}) => {
  return (
    <section className="relative min-h-[calc(100vh-70px)] w-full px-4 sm:px-12 md:px-16 text-center flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* Three.js 3D WebGL Particle Constellation */}
      <CyberHologramCanvas />

      {/* Foreground Typography */}
      <div className="space-y-4 sm:space-y-5 relative z-10 max-w-3xl pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#a8a89f] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Autonomous Threat Intelligence &amp; Personal Safety Guard</span>
        </div>

        <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.08] drop-shadow-md">
          Every Leak Leaves a Clue.
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-[#a8a89f] font-light max-w-2xl mx-auto leading-relaxed px-2">
          Protecting both everyday individuals and defense-grade SOC operators with mathematical Zero-Knowledge privacy.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 pt-6 w-full max-w-md sm:max-w-none justify-center px-4 sm:px-0">
        <button
          onClick={onOpenSafety}
          className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Check Personal Safety (Easy Scan)</span>
        </button>

        <button
          onClick={onOpenHowItWorks}
          className="w-full sm:w-auto bg-[#1c1c1a]/80 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>How to Use</span>
        </button>

        <button
          onClick={onOpenCli}
          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2"
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Get CLI</span>
        </button>
      </div>
    </section>
  );
};
