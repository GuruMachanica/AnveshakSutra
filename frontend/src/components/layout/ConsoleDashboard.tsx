import React from 'react';
import { CyberDnaVisualizer3D } from '../CyberDnaVisualizer3D';
import { DashboardTelemetry } from '../../services/apiClient';

interface ConsoleDashboardProps {
  telemetry: DashboardTelemetry;
  isAttackActive: boolean;
  isSimulating: boolean;
  onSimulateLeak: () => void;
  onSelectNav: (nav: any) => void;
  onOpenModalFeature: (feature: any) => void;
}

export const ConsoleDashboard: React.FC<ConsoleDashboardProps> = ({
  telemetry,
  isAttackActive,
  isSimulating,
  onSimulateLeak,
  onSelectNav,
  onOpenModalFeature,
}) => {
  return (
    <>
      {/* Hero Section */}
      <section className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="AnveshakSutra" className="w-9 h-9 sm:w-12 sm:h-12 object-contain filter invert" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-sans">
            AnveshakSutra SOC
          </h1>
        </div>
        <p className="text-sm sm:text-xl text-[#a8a89f] font-light">
          Every leak leaves a clue. We find it.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={onSimulateLeak}
            disabled={isSimulating}
            className="bg-white hover:bg-neutral-200 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-xl sm:rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
          >
            <span>{isAttackActive ? 'RESET SIMULATOR' : 'SIMULATE REAL-TIME LEAK'}</span>
            <span className="material-symbols-outlined text-[16px]">sensors</span>
          </button>

          <button
            onClick={() => onSelectNav('Personal Safety')}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-xl sm:rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
          >
            <span>SWITCH TO PERSONAL SAFETY</span>
            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          </button>
        </div>
      </section>

      {/* Main 2-Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Card 1: Digital Exposure Health */}
        <div className="lg:col-span-8 bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-5 sm:p-8 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6 sm:mb-10 relative z-10">
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#8e928e] mb-1">
                DIGITAL EXPOSURE HEALTH
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAttackActive ? 'bg-rose-500 animate-ping' : 'bg-white animate-pulse'}`}></div>
                <span className="text-lg sm:text-2xl font-medium text-white">
                  {isAttackActive ? 'Critical Incident' : '• All Protected'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono">
                {isAttackActive ? '01' : '00'}
              </span>
              <span className="text-xs text-[#8e928e] ml-1 font-mono">
                / {telemetry.criticalExposures.toString().padStart(2, '0')} LEAKS
              </span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 relative z-10 text-xs">
            <div className="flex justify-between items-center text-[#8e928e] pb-1 border-b border-white/5">
              <span>Identities Monitored</span>
              <span className="text-white font-medium font-mono">{telemetry.activeIdentities}</span>
            </div>
            <div className="flex justify-between items-center text-[#8e928e] pb-1 border-b border-white/5">
              <span>Critical Secrets Exposed</span>
              <span className={`font-medium font-mono ${isAttackActive ? 'text-rose-400 font-bold' : 'text-white'}`}>
                {isAttackActive ? '1 Active Leak' : `${telemetry.criticalExposures} Finding`}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#8e928e] pb-1 border-b border-white/5">
              <span>Canary Tripwires</span>
              <span className="text-emerald-400 font-medium font-mono">
                {telemetry.activeCanaryTripwires} Armed
              </span>
            </div>
            <div className="flex justify-between items-center text-[#8e928e]">
              <span>Single Point of Failure</span>
              <span className="text-white font-medium font-mono truncate max-w-[160px] sm:max-w-none">{telemetry.betweennessSPOF}</span>
            </div>
          </div>

          {isAttackActive && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>⚠️ AWS STAGING SECRET LEAKED</span>
              <button
                onClick={() => onOpenModalFeature('DAMAGE_CONTROL')}
                className="px-3 py-1 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors self-start sm:self-auto"
              >
                TAKE DAMAGE CONTROL
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Cyber DNA Visualizer */}
        <div className="lg:col-span-4 bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-5 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#8e928e]">
                CYBER DNA™ TOPOLOGY
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">3D FORCE GRAPH</span>
            </div>

            <div className="h-36 sm:h-44 rounded-xl overflow-hidden border border-white/5 relative bg-black/40">
              <CyberDnaVisualizer3D isAttackActive={isAttackActive} />
            </div>
          </div>

          <button
            onClick={() => onSelectNav('Entity Mapping')}
            className="text-xs text-white hover:text-emerald-400 font-semibold flex items-center justify-between pt-2 border-t border-white/5 transition-colors"
          >
            <span>Open Full 3D Map</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onOpenModalFeature('K_ANON')}
          className="p-3.5 sm:p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">lock</span>
          </div>
          <div className="text-xs font-bold text-white">Zero-Knowledge</div>
          <div className="text-[10px] text-[#8e928e] hidden sm:block">Search breaches privately</div>
        </button>

        <button
          onClick={() => onOpenModalFeature('CANARY')}
          className="p-3.5 sm:p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">toll</span>
          </div>
          <div className="text-xs font-bold text-white">Plant Canary</div>
          <div className="text-[10px] text-[#8e928e] hidden sm:block">Generate 0-day tripwires</div>
        </button>

        <button
          onClick={() => onOpenModalFeature('DAMAGE_CONTROL')}
          className="p-3.5 sm:p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">healing</span>
          </div>
          <div className="text-xs font-bold text-white">Damage Control</div>
          <div className="text-[10px] text-[#8e928e] hidden sm:block">401 probe verification</div>
        </button>

        <button
          onClick={() => onSelectNav('Personal Safety')}
          className="p-3.5 sm:p-5 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">health_and_safety</span>
          </div>
          <div className="text-xs font-bold text-white">Personal Safety</div>
          <div className="text-[10px] text-emerald-400 font-medium hidden sm:block">Simple 1-click scan</div>
        </button>
      </div>
    </>
  );
};
