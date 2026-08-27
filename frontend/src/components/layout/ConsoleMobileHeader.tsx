import React from 'react';
import { NavItem } from './ConsoleSidebar';

interface ConsoleMobileHeaderProps {
  activeNav: NavItem;
  onSelectNav: (nav: NavItem) => void;
  onReturnLanding: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const ConsoleMobileHeader: React.FC<ConsoleMobileHeaderProps> = ({
  activeNav,
  onSelectNav,
  onReturnLanding,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <>
      {/* 1. TOP MOBILE APP BAR (< LG) */}
      <header className="lg:hidden h-14 bg-[#0e0e0d] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-40">
        <div 
          onClick={onReturnLanding}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/logo.svg" alt="Logo" className="w-6 h-6 object-contain filter invert" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
            ANVESHAKSUTRA SOC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectNav('Personal Safety')}
            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
            <span>Easy</span>
          </button>

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#8e928e] hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSidebarOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* 2. SMARTPHONE BOTTOM APP NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0e0e0d]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 z-40 flex items-center justify-around text-[10px] font-medium text-[#8e928e]">
        <button
          onClick={() => onSelectNav('Dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeNav === 'Dashboard' ? 'text-white font-bold' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>SOC</span>
        </button>

        <button
          onClick={() => onSelectNav('Personal Safety')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeNav === 'Personal Safety' ? 'text-emerald-400 font-bold' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
          <span>Personal</span>
        </button>

        <button
          onClick={() => onSelectNav('Threat Intelligence')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeNav === 'Threat Intelligence' ? 'text-white font-bold' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>Threats</span>
        </button>

        <button
          onClick={() => onSelectNav('Entity Mapping')}
          className={`flex flex-col items-center gap-0.5 p-1 ${activeNav === 'Entity Mapping' ? 'text-white font-bold' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Graph 3D</span>
        </button>

        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-0.5 p-1 text-[#8e928e]"
        >
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
