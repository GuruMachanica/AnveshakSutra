import React, { useState } from 'react';
import { ArrowRight, Search, ArrowUpRight, ShieldCheck, Heart, Terminal, Menu, X } from 'lucide-react';
import { CyberHologramCanvas } from './CyberHologramCanvas';
import { KAnonymityChecker } from './KAnonymityChecker';
import { CyberDnaVisualizer3D } from './CyberDnaVisualizer3D';
import { LegalDisclosureModal, LegalModalType } from './LegalDisclosureModal';
import { PersonalSafetyHub } from './PersonalSafetyHub';
import { CliDownloadModal } from './CliDownloadModal';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onRequestAccess?: () => void;
  onSignIn?: () => void;
}

type LandingTab = 'HOME' | 'PERSONAL_SAFETY' | 'OSINT' | 'ENTITY_MAPPING' | 'EXPOSURE_REPORTS' | 'METHODOLOGY' | 'INSIGHTS';

export const LandingPageView: React.FC<LandingPageProps> = ({ 
  onLaunchConsole, 
  onRequestAccess = onLaunchConsole, 
  onSignIn = onLaunchConsole,
}) => {
  const [activeTab, setActiveTab] = useState<LandingTab>('HOME');
  const [legalModal, setLegalModal] = useState<LegalModalType>('NONE');
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: LandingTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#131312] text-[#e5e2e0] font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVIGATION BAR (MOBILE & DESKTOP OPTIMIZED)                 */}
      {/* ========================================================================= */}
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
            onClick={() => setIsCliModalOpen(true)}
            className="flex items-center gap-1.5 text-white hover:text-emerald-400 py-1 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Get CLI</span>
          </button>
        </nav>

        {/* Right Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Easy Scan Button for Mobile */}
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

          {/* Mobile Hamburger Toggle Button */}
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
              onClick={() => { setIsCliModalOpen(true); setIsMobileMenuOpen(false); }}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-emerald-400 active:bg-white/10 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Download CLI</span>
            </button>
            <button
              onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
              className="p-3 rounded-xl bg-white text-black font-bold text-left active:bg-neutral-200 flex items-center justify-between"
            >
              <span>SOC Console</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEDICATED PAGE VIEW ROUTER                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full relative z-10">

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE: PERSONAL SAFETY HUB (MOBILE OPTIMIZED)                             */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'PERSONAL_SAFETY' && (
          <div className="py-2 sm:py-6">
            <PersonalSafetyHub />
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 1: HOME LANDING PAGE WITH 3D THREE.JS CANVAS                        */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'HOME' && (
          <div className="space-y-12 sm:space-y-20">
            {/* Hero Section */}
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
                  onClick={() => handleNavClick('PERSONAL_SAFETY')}
                  className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Check Personal Safety (Easy Scan)</span>
                </button>

                <button
                  onClick={() => setIsCliModalOpen(true)}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Download CLI</span>
                </button>

                <button
                  onClick={onRequestAccess}
                  className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  Operator Console
                </button>
              </div>
            </section>

            {/* Feature Pillars */}
            <section className="py-4 sm:py-6 px-4 sm:px-12 md:px-16 lg:px-20 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {/* Pillar 0: Personal Safety Guard */}
                <div 
                  onClick={() => handleNavClick('PERSONAL_SAFETY')}
                  className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 sm:p-7 space-y-2.5 hover:border-emerald-500/60 transition-all group cursor-pointer hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Personal Safety Guard</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </h3>
                  <p className="text-xs text-[#a8a89f] leading-relaxed">
                    Designed for everyday users. Check if your phone number, Instagram, or passwords were leaked with 1-click step-by-step fix guides.
                  </p>
                </div>

                {/* Pillar 1: OSINT Intelligence */}
                <div 
                  onClick={() => handleNavClick('OSINT')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 sm:p-7 space-y-2.5 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#242422] flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">search_insights</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>OSINT Intelligence</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Global sweeps across surface and dark web to identify exposed credentials, leaked documents, and emergent threats before weaponization.
                  </p>
                </div>

                {/* Pillar 2: Entity Mapping */}
                <div 
                  onClick={() => handleNavClick('ENTITY_MAPPING')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 sm:p-7 space-y-2.5 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#242422] flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">hub</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Entity Mapping</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Visualize the blast radius with precision relationship graphs. Connect disparate data points to reveal Single Points of Failure.
                  </p>
                </div>

                {/* Pillar 3: Developer CLI */}
                <div 
                  onClick={() => setIsCliModalOpen(true)}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 sm:p-7 space-y-2.5 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#242422] flex items-center justify-center text-emerald-400 border border-white/10 group-hover:scale-105 transition-transform">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Developer CLI</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Automated code repository scanning, Shannon entropy detection, and autonomous honey-token self-healing terminal binary.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-12 sm:py-16 px-4 text-center space-y-4 w-full">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Secure your accounts and family today.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
                <button
                  onClick={() => handleNavClick('PERSONAL_SAFETY')}
                  className="bg-emerald-400 hover:bg-emerald-300 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105"
                >
                  TRY SIMPLE PERSONAL SCAN
                </button>
                <button
                  onClick={() => setIsCliModalOpen(true)}
                  className="bg-[#1c1c1a] hover:bg-white/10 border border-white/20 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer"
                >
                  DOWNLOAD CLI
                </button>
                <button
                  onClick={onSignIn}
                  className="bg-white hover:bg-neutral-200 text-black text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  ENTER OPERATOR CONSOLE
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 4: DEDICATED PUBLIC REPORT ARCHITECTURE PAGE                         */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'EXPOSURE_REPORTS' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>RFC-2026-AS SPECIFICATION</span>
              </div>
              <h1 className="text-2xl sm:text-5xl font-bold text-white tracking-tight">
                Security Exposure Report Architecture
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                Explore the open anatomical blueprint of the AnveshakSutra Security Exposure Report. Designed for Chief Information Security Officers, incident responders, and compliance auditors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>01. EXECUTIVE RISK SCORECARD</span>
                  <span className="text-[10px] text-rose-400 font-mono">SEV-1 METRIC</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Aggregates total discovered perimeter nodes, verified lateral attack paths, percentage of sensitive asset exposure, and highest clearance role compromised.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>02. LATERAL PATH TOPOLOGY MAPPING</span>
                  <span className="text-[10px] text-emerald-400 font-mono">GRAPH ENGINE</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Generates an interactive mathematical graph connecting credential hashes, infected endpoints, deployment tokens, and cloud infrastructure to pinpoint Single Points of Failure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 2: DEDICATED OSINT INTELLIGENCE PAGE                                 */}
        {/* ------------------------------------------------------------------------- */}
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

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 3: DEDICATED ENTITY MAPPING PAGE                                    */}
        {/* ------------------------------------------------------------------------- */}
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

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 5: DEDICATED METHODOLOGY PAGE                                       */}
        {/* ------------------------------------------------------------------------- */}
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

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 6: DEDICATED INSIGHTS & BENCHMARKS PAGE                             */}
        {/* ------------------------------------------------------------------------- */}
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

      {/* ========================================================================= */}
      {/* 3. GLOBAL MINIMAL FOOTER                                                  */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/10 px-4 sm:px-12 md:px-16 lg:px-20 py-6 bg-[#0e0e0d] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8e928e] font-mono text-center sm:text-left">
        <div>
          © 2026 AnveshakSutra. Zero-Knowledge Threat Intelligence.
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5">
          <button onClick={() => setLegalModal('PRIVACY')} className="hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => setLegalModal('TERMS')} className="hover:text-white transition-colors cursor-pointer">
            Terms of Service
          </button>
          <button onClick={() => setLegalModal('DISCLOSURE')} className="hover:text-white transition-colors cursor-pointer">
            Security Disclosures
          </button>
        </div>
      </footer>

      {/* Legal Modal */}
      {legalModal !== 'NONE' && (
        <LegalDisclosureModal type={legalModal} onClose={() => setLegalModal('NONE')} />
      )}

      {/* CLI Download Modal */}
      <CliDownloadModal isOpen={isCliModalOpen} onClose={() => setIsCliModalOpen(false)} />
    </div>
  );
};
