import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Terminal, Menu, X } from 'lucide-react';

export type LandingTab = 'HOME' | 'PERSONAL_SAFETY' | 'HOW_IT_WORKS' | 'OSINT' | 'ENTITY_MAPPING' | 'EXPOSURE_REPORTS' | 'METHODOLOGY' | 'INSIGHTS';

interface LandingNavbarProps {
  activeTab: LandingTab;
  onTabChange: (tab: LandingTab) => void;
  onOpenCli: () => void;
  onSignIn: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCli,
  onSignIn,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: LandingTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#131312]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 lg:px-20 py-3 flex items-center justify-between w-full">
        {/* Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleNavClick('HOME')}
        >
          <img src="/logo.svg" alt="AnveshakSutra" className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter invert group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase font-sans">
            ANVESHAKSUTRA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#8e928e]">
          <button
            onClick={() => handleNavClick('PERSONAL_SAFETY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer border ${
              activeTab === 'PERSONAL_SAFETY'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-lg shadow-emerald-950/40'
                : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Personal Safety (Easy Mode)</span>
          </button>

          <button
            onClick={() => handleNavClick('HOW_IT_WORKS')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'HOW_IT_WORKS' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            How to Use
          </button>
          <button
            onClick={() => handleNavClick('OSINT')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'OSINT' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            OSINT Radar
          </button>
          <button
            onClick={() => handleNavClick('ENTITY_MAPPING')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'ENTITY_MAPPING' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Entity Mapping
          </button>
          <button
            onClick={() => handleNavClick('EXPOSURE_REPORTS')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'EXPOSURE_REPORTS' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Exposure Reports
          </button>
          <button
            onClick={onOpenCli}
            className="flex items-center gap-1.5 text-white hover:text-emerald-400 py-1 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Get CLI</span>
          </button>
        </nav>

        {/* Right Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('PERSONAL_SAFETY')}
            className="lg:hidden bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Easy Scan</span>
          </button>

          <button
            onClick={onSignIn}
            className="hidden sm:flex bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider py-2 px-3.5 rounded-lg transition-all cursor-pointer shadow-md items-center gap-1.5"
          >
            <span>Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[53px] inset-x-0 bg-[#131312]/98 backdrop-blur-2xl border-b border-white/15 p-5 space-y-3 z-40 animate-fadeIn shadow-2xl">
          <button
            onClick={() => handleNavClick('PERSONAL_SAFETY')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Personal Safety Guard (Easy Mode)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => handleNavClick('HOME')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-neutral-200 active:bg-white/10"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavClick('HOW_IT_WORKS')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-emerald-400 active:bg-white/10"
            >
              📖 How to Use
            </button>
            <button
              onClick={() => handleNavClick('OSINT')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-neutral-200 active:bg-white/10"
            >
              📡 OSINT Radar
            </button>
            <button
              onClick={() => handleNavClick('ENTITY_MAPPING')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-neutral-200 active:bg-white/10"
            >
              🕸️ Entity Mapping
            </button>
            <button
              onClick={() => handleNavClick('EXPOSURE_REPORTS')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-neutral-200 active:bg-white/10"
            >
              📑 Audit Reports
            </button>
            <button
              onClick={() => { onOpenCli(); setIsMobileMenuOpen(false); }}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-purple-400 active:bg-white/10 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Download CLI</span>
            </button>
            <button
              onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
              className="col-span-2 p-3 rounded-xl bg-white text-black font-bold text-left active:bg-neutral-200 flex items-center justify-between"
            >
              <span>Operator SOC Console</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
