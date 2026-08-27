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
import { apiClient, DashboardTelemetry } from './services/apiClient';
import { supabaseAuth } from './services/supabaseAuth';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'LANDING' | 'CONSOLE'>('LANDING');
  const [activeNav, setActiveNav] = useState<'Dashboard' | 'Threat Intelligence' | 'Entity Mapping' | 'Canary Tokens' | 'OSINT Sweeps' | 'Settings' | 'Report' | 'Profile'>('Dashboard');
  const [pendingNav, setPendingNav] = useState<'Dashboard' | 'Report'>('Dashboard');
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(() => {
    return supabaseAuth.getCurrentUser();
  });
  const [activeModalFeature, setActiveModalFeature] = useState<'NONE' | 'K_ANON' | 'CANARY' | 'DAMAGE_CONTROL' | 'CYBER_DNA_FULL'>('NONE');
  const [telemetry, setTelemetry] = useState<DashboardTelemetry>({
    activeIdentities: 6,
    criticalExposures: 0,
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

  const requireAuthAndNavigate = (targetNav: 'Dashboard' | 'Report' = 'Dashboard', signUp: boolean = false) => {
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

  // Operator Console Mode (Exact Stitch Replica)
  return (
    <div className="bg-[#131312] text-[#e5e2e0] h-screen w-screen flex overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (EXACT STITCH REPLICA)                                    */}
      {/* ========================================================================= */}
      <nav className="w-64 h-full bg-[#0e0e0d] border-r border-white/5 flex flex-col p-6 shrink-0 z-30 justify-between">
        
        {/* Top Header with Official Emblem */}
        <div>
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
            {/* 0. Landing Page Quick Return */}
            <button
              onClick={() => setCurrentMode('LANDING')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] transition-colors cursor-pointer mb-2"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Landing Page</span>
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
              <span>Dashboard</span>
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
          </div>
        </div>

        {/* Bottom Sidebar Elements */}
        <div className="space-y-4 pt-4">
          <button
            onClick={() => setActiveNav('Report')}
            className={`w-full text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors ${
              activeNav === 'Report'
                ? 'bg-[#2a2a29] text-white border border-white/20'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">lab_profile</span>
            <span>Generate Report</span>
          </button>

          <div className="border-t border-white/5 pt-3 space-y-1">
            <button
              onClick={() => { setActiveNav('Settings'); setActiveModalFeature('NONE'); }}
              className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs transition-colors cursor-pointer rounded-lg ${
                activeNav === 'Settings'
                  ? 'bg-[#2a2a29] text-white font-semibold'
                  : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">settings</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">database</span>
              <span>Supabase DB</span>
            </button>
            <a
              href="https://github.com/GuruMachanica/AnveshakSutra"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#8e928e] hover:text-white hover:bg-[#1c1c1a] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">help</span>
              <span>Support</span>
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

      {/* ========================================================================= */}
      {/* 2. MAIN CANVAS WITH MULTI-PAGE VIEW ROUTING (FULL SCREEN FIT)             */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full overflow-y-auto px-6 sm:px-10 md:px-14 lg:px-16 py-10 space-y-10 w-full">
        
        {/* Dynamic Modal / Feature Overlay if triggered from Quick Actions */}
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

        {/* View: Admin Profile & Security Settings */}
        {activeNav === 'Profile' && (
          <AdminProfileView 
            currentUser={currentUser}
            onUpdateProfile={(updated) => setCurrentUser(updated)}
            onClose={() => setActiveNav('Dashboard')}
          />
        )}

        {/* View 1: Threat Intelligence Feed */}
        {activeNav === 'Threat Intelligence' && <ThreatIntelView />}

        {/* View 2: Automated OSINT Sweeps */}
        {activeNav === 'OSINT Sweeps' && <OsintSweepsView />}

        {/* View 3: Entity Graph & Relationship Mapping */}
        {activeNav === 'Entity Mapping' && <EntityMappingView />}

        {/* View 4: Canary Tokens Studio */}
        {activeNav === 'Canary Tokens' && <CanaryStudio />}

        {/* View 5: Operator Settings */}
        {activeNav === 'Settings' && <OperatorSettingsView />}

        {/* View 6: Security Exposure Report */}
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
              <div className="pt-3">
                <button
                  onClick={handleSimulateLeak}
                  disabled={isSimulating}
                  className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  <span>{isAttackActive ? 'RESET SIMULATOR' : 'SIMULATE REAL-TIME LEAK'}</span>
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
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
                  <span className="material-symbols-outlined text-[#747878] text-[28px] font-light">
                    health_and_safety
                  </span>
                </div>

                {/* 3 Metric Columns */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 relative z-10">
                  <div>
                    <p className="text-5xl font-normal text-white font-sans">{telemetry.activeIdentities}</p>
                    <p className="text-[10px] font-semibold text-[#8e928e] uppercase tracking-wider mt-1 leading-tight">
                      IDENTITIES<br />MONITORED
                    </p>
                  </div>
                  <div className="border-l border-white/5 pl-6">
                    <p className="text-5xl font-normal text-white font-sans">{telemetry.activeCanaryTripwires}</p>
                    <p className="text-[10px] font-semibold text-[#8e928e] uppercase tracking-wider mt-1 leading-tight">
                      ACTIVE HONEY<br />TRIPWIRES
                    </p>
                  </div>
                  <div className="border-l border-white/5 pl-6">
                    <p className={`text-5xl font-normal font-sans ${isAttackActive ? 'text-rose-400' : 'text-[#8e928e]'}`}>
                      {isAttackActive ? '1' : telemetry.criticalExposures}
                    </p>
                    <p className="text-[10px] font-semibold text-[#8e928e] uppercase tracking-wider mt-1 leading-tight">
                      ACTIVE<br />BREACHES
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Cyber DNA Graph Preview (Col-4) */}
              <div className="lg:col-span-4 bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e]">
                    CYBER DNA GRAPH
                  </h3>
                  <button
                    onClick={() => setActiveNav('Entity Mapping')}
                    className="text-[#8e928e] hover:text-white transition-colors cursor-pointer"
                    title="Open Entity Mapping"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </div>

                <div className="bg-[#181817] border border-white/5 rounded-xl p-5 flex flex-col justify-center items-center relative my-auto min-h-[160px]">
                  <div className="w-full flex justify-between items-center relative py-6 px-3">
                    <div className="absolute top-1/2 left-6 right-6 h-[1px] bg-[#444845]/40 -translate-y-1/2 z-0"></div>

                    {/* Node 1: Email */}
                    <div className="relative z-10 flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-[#20201e] border border-white/10 flex items-center justify-center text-[#8e928e]">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                      </div>
                      <span className="text-[10px] text-[#8e928e]">Email</span>
                    </div>

                    {/* Node 2: GitHub (SPOF) */}
                    <div className="relative z-10 flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-full bg-[#20201e] border border-white flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.12)] relative">
                        <div className="absolute -inset-1 rounded-full border border-white/30 animate-ping opacity-30"></div>
                        <span className="material-symbols-outlined text-[19px]">code_blocks</span>
                      </div>
                      <span className="text-[10px] font-semibold text-white">GitHub</span>
                    </div>

                    {/* Node 3: Cloud */}
                    <div className="relative z-10 flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-[#20201e] border border-white/10 flex items-center justify-center text-[#8e928e]">
                        <span className="material-symbols-outlined text-[16px]">waves</span>
                      </div>
                      <span className="text-[10px] text-[#8e928e]">Cloud</span>
                    </div>
                  </div>

                  <div className="w-full mt-2 bg-[#242422]/90 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-[14px]">warning</span>
                    <span className="text-[10px] font-medium text-white">Single Point of Failure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e] mr-2">
                QUICK ACTIONS
              </span>

              <button
                onClick={() => setActiveModalFeature('K_ANON')}
                className="bg-[#1c1c1a] hover:bg-[#2a2a29] border border-white/10 text-white px-4 py-2.5 rounded-full text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8e928e]">search_insights</span>
                <span>Zero-Knowledge Lookup</span>
              </button>

              <button
                onClick={() => setActiveModalFeature('CANARY')}
                className="bg-[#1c1c1a] hover:bg-[#2a2a29] border border-white/10 text-white px-4 py-2.5 rounded-full text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8e928e]">bug_report</span>
                <span>Deploy Decoy Canary Token</span>
              </button>

              <button
                onClick={() => setActiveModalFeature('DAMAGE_CONTROL')}
                className="bg-[#1c1c1a] hover:bg-[#2a2a29] border border-white/10 text-white px-4 py-2.5 rounded-full text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8e928e]">healing</span>
                <span>Run Damage Control</span>
              </button>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#1c1c1a]/70 border border-white/5 rounded-2xl p-8 space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e]">
                RECENT ACTIVITY LOG
              </h3>

              <div className="divide-y divide-white/5">
                <div className="flex items-start gap-4 py-4 group hover:bg-white/[0.02] transition-colors -mx-6 px-6">
                  <div className="w-8 h-8 rounded-full bg-[#20201e] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-white">verified_user</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Verified Safe Check completed</p>
                    <p className="text-xs text-[#8e928e] mt-0.5">Automated scan across 3 primary identity vectors returned zero anomalies.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#8e928e] block font-mono">10:42 AM</span>
                    <span className="text-[10px] text-[#444845] block mt-0.5">Today</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-4 group hover:bg-white/[0.02] transition-colors -mx-6 px-6">
                  <div className="w-8 h-8 rounded-full bg-[#20201e] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-[#8e928e]">schedule</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Scheduled OSINT Sweep queued</p>
                    <p className="text-xs text-[#8e928e] mt-0.5">Deep web scan initialized for domain configuration.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#8e928e] block font-mono">08:00 AM</span>
                    <span className="text-[10px] text-[#444845] block mt-0.5">Today</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-4 group hover:bg-white/[0.02] transition-colors -mx-6 px-6">
                  <div className="w-8 h-8 rounded-full bg-[#20201e] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                    <span className="material-symbols-outlined text-[16px] text-[#8e928e]">key</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Canary Token deployed: AWS Access Key</p>
                    <p className="text-xs text-[#8e928e] mt-0.5">Decoy key generated and injected into target repository.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#8e928e] block font-mono">Yesterday</span>
                    <span className="text-[10px] text-[#444845] block mt-0.5">14:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Global Footer */}
        <footer className="pt-6 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#8e928e]">
          <div className="uppercase tracking-widest">
            © 2026 AnveshakSutra. Every leak leaves a clue.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Disclosure</a>
          </div>
        </footer>
      </main>

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={() => setIsAuthOpen(false)}
      />
    </div>
  );
};
