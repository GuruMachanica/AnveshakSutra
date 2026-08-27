import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { KAnonymityChecker } from './KAnonymityChecker';
import { CyberDnaVisualizer3D } from './CyberDnaVisualizer3D';
import { LegalDisclosureModal, LegalModalType } from './LegalDisclosureModal';
import { PersonalSafetyHub } from './PersonalSafetyHub';
import { CliDownloadModal } from './CliDownloadModal';
import { LandingNavbar, LandingTab } from './landing/LandingNavbar';
import { LandingHero } from './landing/LandingHero';
import { HowItWorksSection } from './landing/HowItWorksSection';
import { FeaturePillars } from './landing/FeaturePillars';
import { ExposureReportsView } from './landing/ExposureReportsView';
import { LandingFooter } from './landing/LandingFooter';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onRequestAccess?: () => void;
  onSignIn?: () => void;
}

export const LandingPageView: React.FC<LandingPageProps> = ({ 
  onLaunchConsole, 
  onRequestAccess = onLaunchConsole, 
  onSignIn = onLaunchConsole,
}) => {
  const [activeTab, setActiveTab] = useState<LandingTab>('HOME');
  const [legalModal, setLegalModal] = useState<LegalModalType>('NONE');
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);

  const handleTabChange = (tab: LandingTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#131312] text-[#e5e2e0] font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <LandingNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenCli={() => setIsCliModalOpen(true)}
        onSignIn={onSignIn}
      />

      {/* 2. DEDICATED PAGE VIEW ROUTER */}
      <main className="flex-1 w-full relative z-10">

        {/* VIEW: PERSONAL SAFETY HUB (EASY MODE) */}
        {activeTab === 'PERSONAL_SAFETY' && (
          <div className="py-2 sm:py-6">
            <PersonalSafetyHub />
          </div>
        )}

        {/* VIEW: HOW IT WORKS & PLATFORM GUIDE */}
        {activeTab === 'HOW_IT_WORKS' && (
          <HowItWorksSection
            onOpenSafety={() => handleTabChange('PERSONAL_SAFETY')}
            onOpenCli={() => setIsCliModalOpen(true)}
            onSignIn={onSignIn}
          />
        )}

        {/* VIEW: HOME LANDING PAGE */}
        {activeTab === 'HOME' && (
          <div className="space-y-12 sm:space-y-20">
            <LandingHero
              onOpenSafety={() => handleTabChange('PERSONAL_SAFETY')}
              onOpenHowItWorks={() => handleTabChange('HOW_IT_WORKS')}
              onOpenCli={() => setIsCliModalOpen(true)}
            />

            <FeaturePillars
              onOpenSafety={() => handleTabChange('PERSONAL_SAFETY')}
              onOpenHowItWorks={() => handleTabChange('HOW_IT_WORKS')}
              onOpenEntityMapping={() => handleTabChange('ENTITY_MAPPING')}
              onOpenCli={() => setIsCliModalOpen(true)}
            />

            {/* Bottom Call to Action */}
            <section className="py-12 sm:py-16 px-4 text-center space-y-4 w-full">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Secure your accounts and family today.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
                <button
                  onClick={() => handleTabChange('PERSONAL_SAFETY')}
                  className="bg-emerald-400 hover:bg-emerald-300 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105"
                >
                  TRY SIMPLE PERSONAL SCAN
                </button>
                <button
                  onClick={() => handleTabChange('HOW_IT_WORKS')}
                  className="bg-[#1c1c1a] hover:bg-white/10 border border-white/20 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer"
                >
                  READ PLATFORM GUIDE
                </button>
                <button
                  onClick={onRequestAccess}
                  className="bg-white hover:bg-neutral-200 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  REQUEST OPERATOR ACCESS
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: EXPOSURE REPORTS ARCHITECTURE */}
        {activeTab === 'EXPOSURE_REPORTS' && <ExposureReportsView />}

        {/* VIEW: OSINT INTELLIGENCE RADAR */}
        {activeTab === 'OSINT' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <Search className="w-3 h-3 text-white" />
                <span>Zero-Knowledge K-Anonymity Protocol</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Privacy-Preserving OSINT Architecture
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                AnveshakSutra queries global exposure candidate pools without ever transmitting plain-text identifiers. By calculating mathematical SHA-256 prefix buckets, the backend never learns the identity being investigated.
              </p>
            </div>

            <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg w-full">
              <KAnonymityChecker />
            </div>
          </div>
        )}

        {/* VIEW: ENTITY MAPPING */}
        {activeTab === 'ENTITY_MAPPING' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <span className="material-symbols-outlined text-[14px]">hub</span>
                <span>Cyber DNA™ Blast Radius Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                3D Topological Entity Resolution
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                Hardware-accelerated 3D WebGL relationship visualizer identifying topological bottlenecks and attack paths.
              </p>
            </div>

            <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg w-full">
              <CyberDnaVisualizer3D />
            </div>
          </div>
        )}

        {/* VIEW: METHODOLOGY */}
        {activeTab === 'METHODOLOGY' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Scientific &amp; Engineering Methodology
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                AnveshakSutra couples Ring-LWE Lattice-based Homomorphic Private Information Retrieval with Zero-Knowledge SNARK non-exposure proof circuits and Brandes Betweenness Centrality.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: INSIGHTS */}
        {activeTab === 'INSIGHTS' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Empirical Research &amp; Benchmarks
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                Evaluated across $10^7$ breach records with sub-20ms homomorphic query latency and 94.2% lateral blast radius containment.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. GLOBAL MINIMAL FOOTER */}
      <LandingFooter onOpenLegal={(type) => setLegalModal(type)} />

      {/* MODALS */}
      {legalModal !== 'NONE' && (
        <LegalDisclosureModal type={legalModal} onClose={() => setLegalModal('NONE')} />
      )}

      <CliDownloadModal isOpen={isCliModalOpen} onClose={() => setIsCliModalOpen(false)} />
    </div>
  );
};
