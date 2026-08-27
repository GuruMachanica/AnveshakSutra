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
import { AutonomousAgentConsole } from './components/AutonomousAgentConsole';
import { ConsoleSidebar, NavItem } from './components/layout/ConsoleSidebar';
import { ConsoleMobileHeader } from './components/layout/ConsoleMobileHeader';
import { ConsoleDashboard } from './components/layout/ConsoleDashboard';
import { apiClient, DashboardTelemetry } from './services/apiClient';
import { supabaseAuth } from './services/supabaseAuth';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'LANDING' | 'CONSOLE'>('LANDING');
  const [activeNav, setActiveNav] = useState<NavItem>('Dashboard');
  const [pendingNav, setPendingNav] = useState<'Dashboard' | 'Report' | 'Personal Safety'>('Dashboard');
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; clearance?: string; role?: string; avatar?: string } | null>(() => {
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
    setIsMobileSidebarOpen(false);
  };

  const handleNavSelect = (navItem: NavItem) => {
    setActiveNav(navItem);
    setActiveModalFeature('NONE');
    setIsMobileSidebarOpen(false);
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

  // Operator Console Mode (Smartphone & Desktop Modular)
  return (
    <div className="bg-[#131312] text-[#e5e2e0] h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-white/20 selection:text-white relative">
      
      {/* 1. TOP & BOTTOM MOBILE HEADERS */}
      <ConsoleMobileHeader
        activeNav={activeNav}
        onSelectNav={handleNavSelect}
        onReturnLanding={() => setCurrentMode('LANDING')}
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* 2. SIDEBAR NAVIGATION */}
      <ConsoleSidebar
        activeNav={activeNav}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onSelectNav={handleNavSelect}
        onReturnLanding={() => { setCurrentMode('LANDING'); setIsMobileSidebarOpen(false); }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 3. MAIN CANVAS VIEW */}
      <main className="flex-1 h-full overflow-y-auto px-3 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-8 space-y-6 sm:space-y-8 w-full pb-20 lg:pb-8">
        
        {/* Dynamic Interactive Modal Feature */}
        {activeModalFeature !== 'NONE' && (
          <div className="p-4 sm:p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 relative space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs uppercase font-mono tracking-wider text-[#8e928e]">Interactive Tool</span>
              <button
                onClick={() => setActiveModalFeature('NONE')}
                className="text-xs text-white hover:text-rose-400 font-mono cursor-pointer"
              >
                ✕ Close
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

        {/* View: Autonomous AI Agent & ML Console */}
        {activeNav === 'Autonomous Agent' && <AutonomousAgentConsole />}

        {/* View: Admin Profile */}
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

        {/* View: Default Operator Console Dashboard */}
        {activeNav === 'Dashboard' && (
          <ConsoleDashboard
            telemetry={telemetry}
            isAttackActive={isAttackActive}
            isSimulating={isSimulating}
            onSimulateLeak={handleSimulateLeak}
            onSelectNav={handleNavSelect}
            onOpenModalFeature={setActiveModalFeature}
          />
        )}
      </main>
    </div>
  );
};
