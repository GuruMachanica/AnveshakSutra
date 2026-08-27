import React, { useState, useEffect } from 'react';
import { CyberDnaVisualizer3D } from './components/CyberDnaVisualizer3D';
import { KAnonymityChecker } from './components/KAnonymityChecker';
import { CanaryStudio } from './components/CanaryStudio';
import { DamageControlCenter } from './components/DamageControlCenter';
import { ThreatIntelView } from './components/ThreatIntelView';
import { OsintSweepsView } from './components/OsintSweepsView';
import { EntityMappingView } from './components/EntityMappingView';
import { OperatorSettingsView } from './components/OperatorSettingsView';
import { ExposureReportView } from './components/ExposureReportView';
import { LandingPageView } from './components/LandingPageView';
import { AuthModal } from './components/AuthModal';
import { AdminProfileView } from './components/AdminProfileView';
import { PersonalSafetyHub } from './components/PersonalSafetyHub';
import { apiClient, DashboardTelemetry } from './services/apiClient';
import { supabaseAuth } from './services/supabaseAuth';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'LANDING' | 'CONSOLE'>('LANDING');
  const [activeNav, setActiveNav] = useState<'Dashboard' | 'Personal Safety' | 'Threat Intelligence' | 'Entity Mapping' | 'Canary Tokens' | 'OSINT Sweeps' | 'Settings' | 'Report' | 'Profile'>('Dashboard');
  const [pendingNav, setPendingNav] = useState<'Dashboard' | 'Report' | 'Personal Safety'>('Dashboard');
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(() => {
    return supabaseAuth.getCurrentUser();
  });
  const [activeModalFeature, setActiveModalFeature] = useState<'NONE' | 'K_ANON' | 'CANARY' | 'DAMAGE_CONTROL' | 'CYBER_DNA_FULL'>('NONE');
  const [telemetry, setTelemetry] = useState<DashboardTelemetry>({
    activeIdentities: 7,
    criticalExposures: 1,
    activeCanaryTripwires: 2,
    averageBlastRadius: 78,
    betweennessSPOF: 'admin@anveshaksutra.corp (0.88)',
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await apiClient.getDashboardTelemetry();
        setTelemetry(data);
      } catch (err) {
        console.log('Using offline telemetry', err);
      }
    };
    fetchTelemetry();
  }, [currentMode, isAttackActive]);

  const handleSimulateLeak = async () => {
    setIsSimulating(true);
    try {
      if (isAttackActive) {
        await apiClient.resetSimulation();
      } else {
        await apiClient.triggerSimulation();
      }
    } catch {
      console.log('Offline simulation active');
    } finally {
      setIsAttackActive(!isAttackActive);
      setIsSimulating(false);
    }
  };

  const requireAuthAndNavigate = (targetNav: 'Dashboard' | 'Report' | 'Personal Safety' = 'Dashboard', signUp: boolean = false) => {
    if (currentUser) {
      setActiveNav(targetNav);
      setCurrentMode('CONSOLE');
    } else {
      setPendingNav(targetNav);
      setIsSignUpMode(signUp);
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    supabaseAuth.signOut();
    setCurrentUser(null);
    setCurrentMode('LANDING');
    setActiveNav('Dashboard');
  };

  // If in Public Landing Page Mode
  if (currentMode === 'LANDING') {
    return (
      <>
        <LandingPageView
          onLaunchConsole={() => requireAuthAndNavigate('Dashboard', false)}
          onRequestAccess={() => requireAuthAndNavigate('Dashboard', true)}
          onSignIn={() => requireAuthAndNavigate('Dashboard', false)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          initialSignUp={isSignUpMode}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthOpen(false);
            setActiveNav(pendingNav);
            setCurrentMode('CONSOLE');
          }}
        />
      </>
    );
  }

  // Operator Console Mode
  return (
    <div className="bg-[#131312] text-[#e5e2e0] h-screen w-screen flex overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      
      {/* 1. LEFT SIDEBAR */}
      <nav className="w-64 h-full bg-[#0e0e0d] border-r border-white/5 flex flex-col p-6 shrink-0 z-30 justify-between">
        <div>
          {/* Top Header with Emblem */}
          <div 
            onClick={() => setCurrentMode('LANDING')}
            className="mb-8 flex items-start gap-3 cursor-pointer group"
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
          <div className="space-y-1.5">
            {/* 0. Landing Page Return */}
            <button
              onClick={() => setCurrentMode('LANDING')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] transition-colors cursor-pointer mb-2"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Landing Page</span>
            </button>

            {/* Simple Mode Switcher (Personal Safety Guard) */}
            <button
              onClick={() => { setActiveNav('Personal Safety'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer mb-2 border ${
                activeNav === 'Personal Safety'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">health_and_safety</span>
              <span>Personal Safety (Easy)</span>
            </button>

            {/* 1. Dashboard */}
            <button
              onClick={() => { setActiveNav('Dashboard'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Dashboard' && activeModalFeature === 'NONE'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">dashboard</span>
              <span>SOC Dashboard</span>
            </button>

            {/* 2. Threat Intelligence */}
            <button
              onClick={() => { setActiveNav('Threat Intelligence'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Threat Intelligence'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">security</span>
              <span>Threat Intelligence</span>
            </button>

            {/* 3. Entity Mapping */}
            <button
              onClick={() => { setActiveNav('Entity Mapping'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Entity Mapping'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">hub</span>
              <span>Entity Mapping</span>
            </button>

            {/* 4. Canary Tokens */}
            <button
              onClick={() => { setActiveNav('Canary Tokens'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Canary Tokens'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">toll</span>
              <span>Canary Tokens</span>
            </button>

            {/* 5. OSINT Sweeps */}
            <button
              onClick={() => { setActiveNav('OSINT Sweeps'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'OSINT Sweeps'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">radar</span>
              <span>OSINT Sweeps</span>
            </button>

            {/* 6. Settings */}
            <button
              onClick={() => { setActiveNav('Settings'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'Settings'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">settings</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom Sidebar Utility & Profile */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="space-y-1">
            <button
              onClick={() => setActiveNav('Report')}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">description</span>
              <span>Audit Report</span>
            </button>
            <a
              href="https://github.com/GuruMachanica/AnveshakSutra"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">help</span>
              <span>Documentation</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
            <div 
              onClick={() => setActiveNav('Profile')}
              className={`flex items-center gap-2.5 truncate p-1.5 -ml-1.5 rounded-xl transition-all cursor-pointer flex-1 group ${
                activeNav === 'Profile' ? 'bg-[#1c1c1a] border border-white/20' : 'hover:bg-[#1c1c1a]'
              }`}
              title="Open Admin Profile & Security Settings"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n_wplBG1hI-d0L2yPV4GBO7qNLtUl6G7CW3VNLHykvNYau8_uptSPqLUALOz-4qPFOruW3w5b2XNgFbCegBW7WjFaJjY9PpBTE-bz8uvAhgWi6AC2bWTk1B5GToKvy37xC0p8Oyhz1r9QQHrY5sNcBGgUQ3_bklD6ciP0gopiBKd6mR7MaBfk6GGz4o4Zq_AXs1VYC2gwalLpKwg7Rm9GTkBF4IBk1F5bCN10fR603nw722TCso0sLTN5uIEiaKG0VWkI6GYWZY"
                alt="System Administrator"
                className="w-8 h-8 rounded-full object-cover grayscale border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                  {currentUser?.username || 'admin'}
                </span>
                <span className="text-[10px] text-[#8e928e] font-mono truncate">
                  {currentUser?.email || 'operator@anveshaksutra.internal'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#8e928e] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
              title="Sign Out Operator"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CANVAS VIEW ROUTER */}
      <main className="flex-1 h-full overflow-y-auto px-6 sm:px-10 md:px-14 lg:px-16 py-10 space-y-10 w-full">
        
        {/* Dynamic Modal / Feature Overlay */}
        {activeModalFeature !== 'NONE' && (
          <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 relative space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs uppercase font-mono tracking-wider text-[#8e928e]">Interactive Tool</span>
              <button
                onClick={() => setActiveModalFeature('NONE')}
                className="text-xs text-white hover:text-rose-400 font-mono cursor-pointer"
              >
                ✕ Close Workspace
              </button>
            </div>
            {activeModalFeature === 'K_ANON' && <KAnonymityChecker />}
            {activeModalFeature === 'CANARY' && <CanaryStudio />}
            {activeModalFeature === 'DAMAGE_CONTROL' && <DamageControlCenter isAttackActive={isAttackActive} />}
            {activeModalFeature === 'CYBER_DNA_FULL' && <CyberDnaVisualizer3D isAttackActive={isAttackActive} />}
          </div>
        )}

        {/* View: Personal Safety Hub (Simple Mode) */}
        {activeNav === 'Personal Safety' && <PersonalSafetyHub />}

        {/* View: Admin Profile & Security Settings */}
        {activeNav === 'Profile' && (
          <AdminProfileView 
            currentUser={currentUser}
            onUpdateProfile={(updated) => setCurrentUser(updated)}
            onClose={() => setActiveNav('Dashboard')}
          />
        )}

        {/* View: Threat Intelligence Feed */}
        {activeNav === 'Threat Intelligence' && <ThreatIntelView />}

        {/* View: Automated OSINT Sweeps */}
        {activeNav === 'OSINT Sweeps' && <OsintSweepsView />}

        {/* View: Entity Graph & Relationship Mapping */}
        {activeNav === 'Entity Mapping' && <EntityMappingView />}

        {/* View: Canary Tokens Studio */}
        {activeNav === 'Canary Tokens' && <CanaryStudio />}

        {/* View: Operator Settings */}
        {activeNav === 'Settings' && <OperatorSettingsView />}

        {/* View: Security Exposure Report */}
        {activeNav === 'Report' && <ExposureReportView onClose={() => setActiveNav('Dashboard')} />}

        {/* View 0: Default Operator Console Dashboard */}
        {activeNav === 'Dashboard' && (
          <>
            {/* Hero Section with Official Logo */}
            <section className="space-y-3">
              <div className="flex items-center gap-4">
                <img src="/logo.svg" alt="AnveshakSutra" className="w-12 h-12 object-contain filter invert" />
                <h1 className="text-5xl font-bold text-white tracking-tight font-sans">
                  AnveshakSutra
                </h1>
              </div>
              <p className="text-2xl text-[#a8a89f] font-light">
                Every leak leaves a clue. We find it.
              </p>
              <div className="pt-3 flex items-center gap-3">
                <button
                  onClick={handleSimulateLeak}
                  disabled={isSimulating}
                  className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  <span>{isAttackActive ? 'RESET SIMULATOR' : 'SIMULATE REAL-TIME LEAK'}</span>
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
                </button>

                <button
                  onClick={() => setActiveNav('Personal Safety')}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span>SWITCH TO SIMPLE PERSONAL SAFETY</span>
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                </button>
              </div>
            </section>

            {/* Main 2-Card Layout (Digital Exposure Health + Cyber DNA Graph) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Card 1: Digital Exposure Health (Col-8) */}
              <div className="lg:col-span-8 bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e] mb-1.5">
                      DIGITAL EXPOSURE HEALTH
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${isAttackActive ? 'bg-rose-500 animate-ping' : 'bg-white animate-pulse'}`}></div>
                      <span className="text-2xl font-medium text-white">
                        {isAttackActive ? 'Critical Incident Detected' : '• All Protected'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-light tracking-tight text-white font-mono">
                      {isAttackActive ? '01' : '00'}
                    </span>
                    <span className="text-xs text-[#8e928e] ml-1 font-mono">
                      / {telemetry.criticalExposures.toString().padStart(2, '0')} LEAKS
                    </span>
                  </div>
                </div>

                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center text-xs text-[#8e928e] pb-1 border-b border-white/5">
                    <span>Active Digital Identities Monitored</span>
                    <span className="text-white font-medium font-mono">{telemetry.activeIdentities}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8e928e] pb-1 border-b border-white/5">
                    <span>Critical Secrets / Key Findings</span>
                    <span className={`font-medium font-mono ${isAttackActive ? 'text-rose-400 font-bold' : 'text-white'}`}>
                      {isAttackActive ? '1 Active Leak (High Severity)' : `${telemetry.criticalExposures} Finding`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8e928e] pb-1 border-b border-white/5">
                    <span>Active Honey-Token Canary Decoys</span>
                    <span className="text-emerald-400 font-medium font-mono">
                      {telemetry.activeCanaryTripwires} Armed
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8e928e]">
                    <span>Single Point of Failure (Betweenness SPOF)</span>
                    <span className="text-white font-medium font-mono">{telemetry.betweennessSPOF}</span>
                  </div>
                </div>

                {isAttackActive && (
                  <div className="mt-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center justify-between">
                    <span>⚠️ STAGING AWS SECRET EXPOSED IN PUBLIC REPO DIFF</span>
                    <button
                      onClick={() => setActiveModalFeature('DAMAGE_CONTROL')}
                      className="px-3 py-1 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors"
                    >
                      TAKE DAMAGE CONTROL
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Cyber DNA Quick Visualizer (Col-4) */}
              <div className="lg:col-span-4 bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e]">
                      CYBER DNA™ TOPOLOGY
                    </h3>
                    <span className="text-xs font-mono text-emerald-400">3D FORCE GRAPH</span>
                  </div>

                  <div className="h-44 rounded-xl overflow-hidden border border-white/5 relative bg-black/40">
                    <CyberDnaVisualizer3D isAttackActive={isAttackActive} />
                  </div>

                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Dynamic graph neural topology mapping perimeter assets, lateral paths, and betweenness bottlenecks.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setActiveNav('Entity Mapping')}
                    className="text-xs text-white hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Full 3D Map View</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Dock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveModalFeature('K_ANON')}
                className="p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="text-xs font-bold text-white">Zero-Knowledge Lookup</div>
                <div className="text-[10px] text-[#8e928e]">Search breaches with 0 metadata leakage</div>
              </button>

              <button
                onClick={() => setActiveModalFeature('CANARY')}
                className="p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">toll</span>
                </div>
                <div className="text-xs font-bold text-white">Plant Canary Decoy</div>
                <div className="text-[10px] text-[#8e928e]">Generate 0-day tripwire tokens</div>
              </button>

              <button
                onClick={() => setActiveModalFeature('DAMAGE_CONTROL')}
                className="p-5 bg-[#1c1c1a] border border-white/5 hover:border-white/20 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">healing</span>
                </div>
                <div className="text-xs font-bold text-white">Damage Control &amp; Heal</div>
                <div className="text-[10px] text-[#8e928e]">Active 401 probe verification</div>
              </button>

              <button
                onClick={() => setActiveNav('Personal Safety')}
                className="p-5 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                </div>
                <div className="text-xs font-bold text-white">Personal Safety Guard</div>
                <div className="text-[10px] text-emerald-400 font-medium">Simple 1-click everyday scan</div>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
