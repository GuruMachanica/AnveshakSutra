import React from 'react';

export type NavItem = 'Dashboard' | 'Autonomous Agent' | 'Personal Safety' | 'Threat Intelligence' | 'Entity Mapping' | 'Canary Tokens' | 'OSINT Sweeps' | 'Settings' | 'Report' | 'Profile';

interface ConsoleSidebarProps {
  activeNav: NavItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (nav: NavItem) => void;
  onReturnLanding: () => void;
  currentUser: { username: string; email: string } | null;
  onLogout: () => void;
}

export const ConsoleSidebar: React.FC<ConsoleSidebarProps> = ({
  activeNav,
  isOpen,
  onClose,
  onSelectNav,
  onReturnLanding,
  currentUser,
  onLogout,
}) => {
  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <nav 
        className={`w-64 h-full bg-[#0e0e0d] border-r border-white/5 flex flex-col p-5 shrink-0 z-50 justify-between fixed lg:relative inset-y-0 left-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Header with Emblem */}
          <div 
            onClick={onReturnLanding}
            className="mb-6 flex items-start gap-3 cursor-pointer group"
            title="Return to Public Landing Page"
          >
            <img src="/logo.svg" alt="AnveshakSutra Emblem" className="w-7 h-7 object-contain mt-0.5 filter invert group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight group-hover:text-neutral-200 transition-colors">Operator Console</h1>
              <p className="text-[10px] font-semibold text-[#8e928e] uppercase tracking-widest mt-0.5">
                VERIFIED STATUS
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <button
              onClick={onReturnLanding}
              className="w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] transition-colors cursor-pointer mb-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Landing Page</span>
            </button>

            <button
              onClick={() => onSelectNav('Personal Safety')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer mb-2 border ${
                activeNav === 'Personal Safety'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-emerald-500/40 shadow-lg'
                  : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
              <span>Personal Safety (Easy)</span>
            </button>

            <button
              onClick={() => onSelectNav('Dashboard')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Dashboard'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>SOC Dashboard</span>
            </button>

            <button
              onClick={() => onSelectNav('Autonomous Agent')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Autonomous Agent'
                  ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30 font-semibold shadow-md'
                  : 'text-[#8e928e] hover:text-purple-400 hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span>Autonomous AI Agent</span>
            </button>

            <button
              onClick={() => onSelectNav('Threat Intelligence')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Threat Intelligence'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              <span>Threat Intel Radar</span>
            </button>

            <button
              onClick={() => onSelectNav('Entity Mapping')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Entity Mapping'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              <span>Entity Mapping 3D</span>
            </button>

            <button
              onClick={() => onSelectNav('Canary Tokens')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Canary Tokens'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">toll</span>
              <span>Canary Tokens</span>
            </button>

            <button
              onClick={() => onSelectNav('OSINT Sweeps')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'OSINT Sweeps'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">radar</span>
              <span>OSINT Sweeps</span>
            </button>

            <button
              onClick={() => onSelectNav('Settings')}
              className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Settings'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom Sidebar Utility & Profile */}
        <div className="space-y-3 pt-3 border-t border-white/5">
          <div className="space-y-1">
            <button
              onClick={() => onSelectNav('Report')}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Audit Report</span>
            </button>
            <a
              href="https://github.com/GuruMachanica/AnveshakSutra"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">help</span>
              <span>Docs</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
            <div 
              onClick={() => onSelectNav('Profile')}
              className={`flex items-center gap-2 truncate p-1.5 -ml-1 rounded-xl transition-all cursor-pointer flex-1 group ${
                activeNav === 'Profile' ? 'bg-[#1c1c1a] border border-white/20' : 'hover:bg-[#1c1c1a]'
              }`}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n_wplBG1hI-d0L2yPV4GBO7qNLtUl6G7CW3VNLHykvNYau8_uptSPqLUALOz-4qPFOruW3w5b2XNgFbCegBW7WjFaJjY9PpBTE-bz8uvAhgWi6AC2bWTk1B5GToKvy37xC0p8Oyhz1r9QQHrY5sNcBGgUQ3_bklD6ciP0gopiBKd6mR7MaBfk6GGz4o4Zq_AXs1VYC2gwalLpKwg7Rm9GTkBF4IBk1F5bCN10fR603nw722TCso0sLTN5uIEiaKG0VWkI6GYWZY"
                alt="Admin"
                className="w-7 h-7 rounded-full object-cover grayscale border border-white/10 shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white tracking-tight truncate">
                  {currentUser?.username || 'admin'}
                </span>
                <span className="text-[9px] text-[#8e928e] font-mono truncate">
                  {currentUser?.email || 'operator@corp'}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#8e928e] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
