import React, { useState } from 'react';
import { ArrowRight, Check, Share2, Search, ArrowUpRight } from 'lucide-react';
import { CyberHologramCanvas } from './CyberHologramCanvas';
import { KAnonymityChecker } from './KAnonymityChecker';
import { CyberDnaVisualizer3D } from './CyberDnaVisualizer3D';
import { LegalDisclosureModal, LegalModalType } from './LegalDisclosureModal';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onRequestAccess?: () => void;
  onSignIn?: () => void;
}

type LandingTab = 'HOME' | 'OSINT' | 'ENTITY_MAPPING' | 'EXPOSURE_REPORTS' | 'METHODOLOGY' | 'INSIGHTS';

export const LandingPageView: React.FC<LandingPageProps> = ({ 
  onLaunchConsole, 
  onRequestAccess = onLaunchConsole, 
  onSignIn = onLaunchConsole,
}) => {
  const [activeTab, setActiveTab] = useState<LandingTab>('HOME');
  const [legalModal, setLegalModal] = useState<LegalModalType>('NONE');

  return (
    <div className="min-h-screen w-full bg-[#131312] text-[#e5e2e0] font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#131312]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 md:px-16 lg:px-20 py-3.5 flex items-center justify-between w-full">
        {/* Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('HOME')}
        >
          <img src="/logo.svg" alt="AnveshakSutra" className="w-7 h-7 object-contain filter invert group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase font-sans">
            ANVESHAKSUTRA
          </span>
        </div>

        {/* Center Dedicated Page Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#8e928e]">
          <button
            onClick={() => setActiveTab('OSINT')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'OSINT' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            OSINT
          </button>
          <button
            onClick={() => setActiveTab('ENTITY_MAPPING')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'ENTITY_MAPPING' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Entity Mapping
          </button>
          <button
            onClick={() => setActiveTab('EXPOSURE_REPORTS')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'EXPOSURE_REPORTS' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Exposure Reports
          </button>
          <button
            onClick={() => setActiveTab('METHODOLOGY')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'METHODOLOGY' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Methodology
          </button>
          <button
            onClick={() => setActiveTab('INSIGHTS')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'INSIGHTS' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            Insights
          </button>
        </nav>

        {/* CTA Launch Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSignIn}
            className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-1.5"
          >
            <span>Operator Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DEDICATED PAGE VIEW ROUTER                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full relative z-10">

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 1: HOME LANDING PAGE WITH 3D THREE.JS CANVAS                        */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'HOME' && (
          <div className="space-y-20">
            {/* Hero Section - Refined Proportions & Sleek Scale */}
            <section className="relative min-h-[calc(100vh-76px)] w-full px-6 sm:px-12 md:px-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
              
              {/* Three.js 3D WebGL Particle Constellation */}
              <CyberHologramCanvas />

              {/* Foreground Typography */}
              <div className="space-y-5 relative z-10 max-w-3xl pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#a8a89f] backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Autonomous Threat Intelligence Engine</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.06] drop-shadow-md">
                  Every Leak Leaves a Clue.
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-[#a8a89f] font-light max-w-2xl mx-auto leading-relaxed">
                  The ultimate OSINT and entity relationship platform for the modern security operator.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 relative z-10 pt-6">
                <button
                  onClick={onRequestAccess}
                  className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-widest py-3 px-7 rounded-lg transition-all cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:scale-105"
                >
                  REQUEST ACCESS
                </button>

                <button
                  onClick={() => setActiveTab('METHODOLOGY')}
                  className="w-full sm:w-auto bg-[#1c1c1a]/80 hover:bg-white/10 border border-white/15 text-white text-[11px] font-bold uppercase tracking-widest py-3 px-7 rounded-lg transition-all cursor-pointer backdrop-blur-md"
                >
                  VIEW METHODOLOGY
                </button>
              </div>
            </section>

            {/* Three Feature Pillars - Refined Scale */}
            <section className="py-6 px-6 sm:px-12 md:px-16 lg:px-20 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pillar 1: OSINT Intelligence */}
                <div 
                  onClick={() => setActiveTab('OSINT')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 lg:p-7 space-y-3 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#242422] flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">search_insights</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>OSINT Intelligence</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Global sweeps across surface and dark web to identify exposed credentials, leaked documents, and emergent threats before they are weaponized.
                  </p>
                </div>

                {/* Pillar 2: Entity Mapping */}
                <div 
                  onClick={() => setActiveTab('ENTITY_MAPPING')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 lg:p-7 space-y-3 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#242422] flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">hub</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Entity Mapping</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Visualize the blast radius with precision relationship graphs. Connect disparate data points to reveal hidden corporate structures and threat actor networks.
                  </p>
                </div>

                {/* Pillar 3: Canary Tripwires */}
                <div 
                  onClick={() => setActiveTab('METHODOLOGY')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 lg:p-7 space-y-3 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#242422] flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">warning</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Canary Tripwires</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Deploy zero-knowledge decoys to detect breaches before they happen. Silent alarms that alert you the moment your perimeter is tested.
                  </p>
                </div>
              </div>
            </section>

            {/* Executive Disclosure Showcase - Refined Scale */}
            <section className="py-12 px-6 sm:px-12 md:px-16 lg:px-20 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Description */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8e928e]">
                    EXECUTIVE DISCLOSURE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    The Security Exposure Report
                  </h2>
                  <p className="text-xs text-[#a8a89f] leading-relaxed">
                    A sophisticated, executive-level disclosure format for critical vulnerabilities. Filter the noise and deliver actionable intelligence to stakeholders with clarity and authority.
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2.5 text-xs text-white">
                      <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Immutable cryptographic logging</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white">
                      <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Automated impact scoring</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('EXPOSURE_REPORTS')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-neutral-300 border-b border-white/30 pb-0.5 transition-colors cursor-pointer pt-1"
                  >
                    <span>Inspect Report Architecture</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Right Interactive Preview Card */}
                <div className="lg:col-span-7 bg-[#1c1c1a] border border-white/10 rounded-xl p-5 sm:p-7 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 font-mono text-[10px]">
                    <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                      CRITICAL ALERT
                    </span>
                    <span className="text-[#8e928e]">T-MINUS 00:00:00</span>
                  </div>

                  {/* Connected Entity Preview */}
                  <div className="bg-[#141413] border border-white/5 rounded-lg p-5 relative flex flex-col justify-center items-center min-h-[190px]">
                    <div className="w-full flex justify-between items-center relative py-6 px-4">
                      <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-white/20 -translate-y-1/2 z-0"></div>

                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="w-9 h-9 rounded-full bg-[#20201e] border border-white/20 flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[15px]">mail</span>
                        </div>
                        <span className="text-[10px] text-[#8e928e] font-mono">admin@corp</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="w-11 h-11 rounded-full bg-[#20201e] border-2 border-white flex items-center justify-center text-white shadow-[0_0_18px_rgba(255,255,255,0.2)]">
                          <span className="material-symbols-outlined text-[19px]">hub</span>
                        </div>
                        <span className="text-[10px] font-bold text-white font-mono">Lateral Hub (SPOF)</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="w-9 h-9 rounded-full bg-rose-950/40 border border-rose-500/40 flex items-center justify-center text-rose-400">
                          <span className="material-symbols-outlined text-[15px]">cloud</span>
                        </div>
                        <span className="text-[10px] text-rose-400 font-mono">AWS Staging</span>
                      </div>
                    </div>

                    <div className="w-full mt-3 bg-[#242422] border border-white/10 rounded-md px-3 py-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-white font-mono">Betweenness Centrality: 0.94</span>
                      <span className="text-rose-400 font-bold font-mono">COMPROMISE PATH VERIFIED</span>
                    </div>
                  </div>

                  {/* Skeleton lines */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-2 rounded bg-white/10"></div>
                    <div className="w-4/5 h-2 rounded bg-white/5"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-16 px-6 text-center space-y-4 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Secure your perimeter.
              </h2>
              <div>
                <button
                  onClick={onSignIn}
                  className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-widest py-3 px-8 rounded-lg transition-all cursor-pointer shadow-md hover:scale-105"
                >
                  GET STARTED
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 4: DEDICATED PUBLIC REPORT ARCHITECTURE PAGE                         */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'EXPOSURE_REPORTS' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>RFC-2026-AS SPECIFICATION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Security Exposure Report Architecture
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                Explore the open anatomical blueprint of the AnveshakSutra Security Exposure Report. Designed for Chief Information Security Officers, incident responders, and compliance auditors to eliminate alert fatigue with mathematical precision.
              </p>
            </div>

            {/* Anatomical Blueprint Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Section 1: Executive Scorecard */}
              <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>01. EXECUTIVE RISK SCORECARD</span>
                  <span className="text-[10px] text-rose-400 font-mono">SEV-1 METRIC</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Aggregates total discovered perimeter nodes, verified lateral attack paths, percentage of sensitive asset exposure, and highest clearance role compromised (e.g. Super Admin Level 4).
                </p>
                <div className="p-3 rounded-lg bg-[#141413] border border-white/5 font-mono text-[10px] text-white flex justify-between">
                  <span>Betweenness Centrality: &gt;0.85</span>
                  <span className="text-rose-400 font-bold">CRITICAL EXPOSURE</span>
                </div>
              </div>

              {/* Section 2: Blast Radius Topology */}
              <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>02. LATERAL PATH TOPOLOGY MAPPING</span>
                  <span className="text-[10px] text-emerald-400 font-mono">GRAPH ENGINE</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Generates an interactive mathematical graph connecting credential hashes, infected endpoints, deployment tokens, and cloud infrastructure to pinpoint Single Points of Failure (SPOF).
                </p>
                <div className="p-3 rounded-lg bg-[#141413] border border-white/5 font-mono text-[10px] text-white flex justify-between">
                  <span>Graph Traversal Algorithm</span>
                  <span className="text-[#8e928e]">Dijkstra Shortest Path</span>
                </div>
              </div>

              {/* Section 3: Chronological Timeline */}
              <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>03. INCIDENT RECONSTRUCTION TIMELINE</span>
                  <span className="text-[10px] text-white font-mono">CHRONO LOG</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Reconstructs the minute-by-minute sequence of events from initial credential dump detection through lateral CI/CD key discovery to Canary Tripwire detonation.
                </p>
                <div className="p-3 rounded-lg bg-[#141413] border border-white/5 font-mono text-[10px] text-white flex justify-between">
                  <span>Temporal Precision</span>
                  <span className="text-emerald-400">Microsecond UTC Nonces</span>
                </div>
              </div>

              {/* Section 4: Automated Remediation */}
              <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                  <span>04. AUTOMATED REMEDIATION PLAYBOOKS</span>
                  <span className="text-[10px] text-white font-mono">CONTAINMENT</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Generates direct, executable CLI and API commands for instant token revocation, IP isolation, lateral network segmentation, and passkey re-authentication.
                </p>
                <div className="p-3 rounded-lg bg-[#141413] border border-white/5 font-mono text-[10px] text-white flex justify-between">
                  <span>Remediation Engine</span>
                  <span className="text-white font-bold">1-Click Key Revocation</span>
                </div>
              </div>
            </div>

            {/* Public Spec Interactive Sample Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1c1c1a] border border-white/10 space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-4">
                <div>
                  <div className="text-xs font-mono font-bold text-white uppercase">ANATOMICAL SPECIFICATION SAMPLE: AS-2024-8991</div>
                  <div className="text-[10px] font-mono text-[#8e928e]">CONFIDENTIAL SECURITY DISCLOSURE BENCHMARK</div>
                </div>

                <button
                  onClick={onSignIn}
                  className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Launch Console for Live Asset Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-1">
                  <span className="text-[#8e928e] text-[10px]">EVIDENCE CRYPTOGRAPHIC HASH</span>
                  <div className="text-white text-[11px] truncate">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                </div>
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-1">
                  <span className="text-[#8e928e] text-[10px]">DECEPTION TRIPWIRE AUDIT</span>
                  <div className="text-rose-400 text-[11px]">AWS_SECRET_KEY_CANARY_04 DETONATED</div>
                </div>
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-1">
                  <span className="text-[#8e928e] text-[10px]">DISCLOSURE CLASSIFICATION</span>
                  <div className="text-amber-400 text-[11px]">TLP:AMBER+STRICT / CISO BRIEF</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 2: DEDICATED OSINT INTELLIGENCE PAGE                                 */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'OSINT' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <Search className="w-3 h-3 text-white" />
                <span>Zero-Knowledge K-Anonymity Protocol</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Privacy-Preserving OSINT Architecture
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                AnveshakSutra queries global exposure candidate pools without ever transmitting plain-text identifiers. By calculating mathematical SHA-256 prefix buckets, the backend never learns the identity being investigated.
              </p>
            </div>

            {/* Interactive Zero-Knowledge Live Test */}
            <div className="bg-[#1c1c1a] border border-white/10 rounded-xl p-5 sm:p-7 space-y-4 shadow-lg w-full">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-white uppercase font-bold">Interactive Zero-Knowledge Proof Test</span>
                <span className="text-[10px] font-mono text-emerald-400">MATHEMATICALLY PROVABLE ZERO-KNOWLEDGE</span>
              </div>
              <KAnonymityChecker />
            </div>

            {/* 3 Vectors Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-[#1c1c1a] border border-white/5 rounded-xl p-6 space-y-2">
                <span className="material-symbols-outlined text-white text-[22px]">dataset</span>
                <h3 className="text-sm font-bold text-white">Surface Web Dumps</h3>
                <p className="text-xs text-[#8e928e] leading-relaxed">Continuous ingestion from public code repositories, commit diffs, Pastebin pastes, and public buckets.</p>
              </div>

              <div className="bg-[#1c1c1a] border border-white/5 rounded-xl p-6 space-y-2">
                <span className="material-symbols-outlined text-white text-[22px]">forum</span>
                <h3 className="text-sm font-bold text-white">Dark Forum Combolists</h3>
                <p className="text-xs text-[#8e928e] leading-relaxed">Zero-leak cryptographic indexing across Tor hidden services and private Telegram leak channels.</p>
              </div>

              <div className="bg-[#1c1c1a] border border-white/5 rounded-xl p-6 space-y-2">
                <span className="material-symbols-outlined text-white text-[22px]">verified_user</span>
                <h3 className="text-sm font-bold text-white">Active Probes</h3>
                <p className="text-xs text-[#8e928e] leading-relaxed">Non-intrusive challenge-response verification probes confirming if exposed credentials remain active.</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 3: DEDICATED ENTITY MAPPING & BLAST RADIUS PAGE                      */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'ENTITY_MAPPING' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#a8a89f]">
                <Share2 className="w-3 h-3 text-white" />
                <span>Blast Radius & Lateral Attack Path Topology</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Entity Relationship & Blast Radius Mapping
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                Single points of failure (SPOF) frequently turn localized credential leaks into organization-wide takeovers. Our graph engine dynamically computes betweenness centrality across identities, devices, tokens, and data clusters.
              </p>
            </div>

            {/* Interactive 3D Cyber DNA Visualizer */}
            <div className="bg-[#1c1c1a] border border-white/10 rounded-xl p-5 sm:p-7 space-y-4 shadow-lg w-full">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-white uppercase font-bold">Interactive 3D Graph Simulation</span>
                <span className="text-[10px] font-mono text-[#8e928e]">CLICK & DRAG TO ROTATE TOPOLOGY</span>
              </div>
              <CyberDnaVisualizer3D isAttackActive={true} />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 4: DEDICATED EXPOSURE REPORTS PAGE                                  */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'EXPOSURE_REPORTS' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Confidential Exposure Reporting
              </h1>
              <p className="text-xs sm:text-sm text-[#a8a89f]">
                Standardized, audit-grade disclosure documentation designed for Chief Information Security Officers and board-level risk committees.
              </p>
            </div>

            <div className="bg-[#1c1c1a] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 w-full">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <div className="text-xs font-mono font-bold text-white uppercase">STANDARDIZED DISCLOSURE SPECIFICATION</div>
                  <div className="text-[10px] font-mono text-[#8e928e] mt-0.5">RFC-2026-AS / EXPOSURE HEALTH ASSESSMENT</div>
                </div>
                <button
                  onClick={onLaunchConsole}
                  className="bg-white hover:bg-neutral-200 text-black text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Generate Live Report
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#a8a89f] leading-relaxed">
                <p>
                  Every AnveshakSutra report combines high-fidelity canary tripwire timestamps, lateral graph traversal paths, and cryptographic proof hashes into an executive summary that eliminates guesswork.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-[#141413] border border-white/5 space-y-1.5">
                    <div className="text-white font-bold font-mono text-xs">01. Cryptographic Immutability</div>
                    <p className="text-[11px] text-[#8e928e]">Timestamped with zero-knowledge nonces to guarantee tamper-proof audit trails.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#141413] border border-white/5 space-y-1.5">
                    <div className="text-white font-bold font-mono text-xs">02. Automated Remediation Steps</div>
                    <p className="text-[11px] text-[#8e928e]">Direct API commands to invalidate leaked access keys and cycle affected canary endpoints.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 5: DEDICATED METHODOLOGY PAGE                                       */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'METHODOLOGY' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e928e]">TECHNICAL RFC 2026</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">The AnveshakSutra Security Methodology</h1>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
                AnveshakSutra operates on three foundational cybersecurity axioms: Zero-Knowledge Query Invariance, Honey-Token Deception Networks, and Autonomous Blast Radius Containment.
              </p>
            </div>

            <div className="space-y-4 w-full">
              <div className="p-6 rounded-xl bg-[#1c1c1a] border border-white/10 space-y-2">
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-black text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Zero-Knowledge K-Anonymity (k=32)</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Queries send only the first 5 hex characters of the target SHA-256 hash. The server returns all matching candidate hashes. The client browser performs the exact match in local memory. The server never observes who was checked.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#1c1c1a] border border-white/10 space-y-2">
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-black text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Deception Honey-Tokens (Canaries)</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Decoy AWS access keys, GitHub personal access tokens, and database connection strings are salted and embedded in low-priority staging repositories. Any authentication attempt against these tokens triggers immediate SOC containment.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#1c1c1a] border border-white/10 space-y-2">
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white text-black text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Autonomous Threat Investigator (Agentic Cycle)</span>
                </div>
                <p className="text-xs text-[#8e928e] leading-relaxed">
                  Runs self-healing assessment cycles in pure Python asyncio, correlating threat actor signatures (NullSyndicate, SilentVoid) with monitored identity assets and executing containment without human latency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* PAGE 6: DEDICATED INSIGHTS & THREAT FEED PAGE                             */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'INSIGHTS' && (
          <div className="py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full space-y-8">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Threat Intelligence Insights</h1>
              <p className="text-xs sm:text-sm text-[#a8a89f]">Research advisories, 0-day credential trends, and threat actor profiling from the AnveshakSutra lab.</p>
            </div>

            <div className="space-y-4 w-full">
              <div className="p-6 rounded-xl bg-[#1c1c1a] border border-white/10 space-y-2 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-rose-400 font-bold">ADVISORY AS-2026-04</span>
                  <span className="text-[#8e928e]">Published 2h ago</span>
                </div>
                <h3 className="text-base font-bold text-white">NullSyndicate Launches Automated CI/CD Key Extraction Sweeps</h3>
                <p className="text-xs text-[#8e928e] leading-relaxed">New botnet signatures detected querying misconfigured GitHub Actions workflow runs for exposed deploy tokens.</p>
              </div>

              <div className="p-6 rounded-xl bg-[#1c1c1a] border border-white/10 space-y-2 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">RESEARCH WHITE-PAPER</span>
                  <span className="text-[#8e928e]">Published Yesterday</span>
                </div>
                <h3 className="text-base font-bold text-white">Mitigating Betweenness Centrality Risk in Modern DevOps Topology</h3>
                <p className="text-xs text-[#8e928e] leading-relaxed">How single administrator personal access tokens create lateral exposure vectors that compromise multi-cloud perimeters.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. GLOBAL FOOTER                                                          */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/5 py-10 px-6 sm:px-12 md:px-16 lg:px-20 w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8e928e] relative z-10">
        <div className="space-y-0.5 text-center md:text-left">
          <div className="text-xs font-bold tracking-widest text-white uppercase font-sans">ANVESHAKSUTRA</div>
          <div className="text-[11px] text-[#8e928e]">© 2026 AnveshakSutra. Open-Source Security Research Project (Non-Commercial Prototype).</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
          <button onClick={() => setLegalModal('PRIVACY')} className="hover:text-white transition-colors cursor-pointer uppercase">PRIVACY PROTOCOL</button>
          <button onClick={() => setLegalModal('TERMS')} className="hover:text-white transition-colors cursor-pointer uppercase">TERMS OF ENGAGEMENT</button>
          <button onClick={() => setLegalModal('DISCLOSURE')} className="hover:text-white transition-colors cursor-pointer uppercase">INTELLIGENCE DISCLOSURE</button>
          <button onClick={() => setLegalModal('CONTACT')} className="text-white hover:text-neutral-300 font-bold transition-colors cursor-pointer uppercase">
            CONTACT TERMINAL
          </button>
        </div>
      </footer>

      {/* Legal & SOC Disclosure Modal */}
      <LegalDisclosureModal 
        type={legalModal}
        onClose={() => setLegalModal('NONE')}
      />
    </div>
  );
};
