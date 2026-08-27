import React from 'react';
import { Zap, Lock, RefreshCw, LogOut, LogIn, Database } from 'lucide-react';

interface HeaderProps {
  isAttackActive: boolean;
  onTriggerSimulation: () => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
  user: { username: string; email: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const SimulationHeader: React.FC<HeaderProps> = ({
  isAttackActive,
  onTriggerSimulation,
  onResetSimulation,
  isSimulating,
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#131312]/95 backdrop-blur-md border-b border-luxury-border px-4 sm:px-6 lg:px-12 2xl:px-20 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-luxury-ivory text-luxury-base flex items-center justify-center font-bold text-base shadow-sm">
          अ
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-semibold tracking-tight text-luxury-ivory flex items-center gap-2">
            AnveshakSutra <span className="text-luxury-muted font-normal text-xs font-mono">(अन्वेषकसूत्र)</span>
          </h1>
          <p className="text-[11px] text-luxury-muted hidden sm:block">Autonomous Identity Exposure Intelligence</p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
        <div className="pill-tag bg-white/5 border border-white/10 text-luxury-muted">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase Connected</span>
        </div>
        <div className="pill-tag bg-white/5 border border-white/10 text-luxury-muted">
          <Lock className="w-3.5 h-3.5 text-luxury-accentCyan" />
          <span>Zero-Knowledge Mode</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <div className="flex items-center gap-2 bg-luxury-elevated border border-luxury-border rounded-xl px-2.5 sm:px-3 py-1.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-luxury-ivory text-luxury-base flex items-center justify-center font-bold text-[10px]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-luxury-ivory text-xs">{user.username}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-luxury-muted hover:text-rose-400 p-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl bg-luxury-elevated hover:bg-luxury-highest text-luxury-ivory text-xs font-medium flex items-center gap-1.5 transition-all border border-luxury-border cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
        )}

        {/* Real-time Attack Simulation Trigger */}
        {!isAttackActive ? (
          <button
            onClick={onTriggerSimulation}
            disabled={isSimulating}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-luxury-ivory hover:bg-white text-luxury-base font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
          >
            {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">⚡ Simulate Attack</span>
            <span className="sm:hidden">⚡ Test</span>
          </button>
        ) : (
          <button
            onClick={onResetSimulation}
            className="px-3.5 py-2 rounded-xl bg-luxury-surface hover:bg-luxury-elevated text-luxury-ivory font-medium text-xs flex items-center gap-1.5 transition-all border border-luxury-border cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </header>
  );
};
