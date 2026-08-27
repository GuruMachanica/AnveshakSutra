import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  ArrowUpRight, 
  ShieldCheck, 
  Heart, 
  Terminal, 
  Menu, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Building2, 
  UserCheck 
} from 'lucide-react';
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

type LandingTab = 'HOME' | 'PERSONAL_SAFETY' | 'HOW_IT_WORKS' | 'OSINT' | 'ENTITY_MAPPING' | 'EXPOSURE_REPORTS' | 'METHODOLOGY' | 'INSIGHTS';

export const LandingPageView: React.FC<LandingPageProps> = ({ 
  onLaunchConsole, 
  onRequestAccess = onLaunchConsole, 
  onSignIn = onLaunchConsole,
}) => {
  const [activeTab, setActiveTab] = useState<LandingTab>('HOME');
  const [legalModal, setLegalModal] = useState<LegalModalType>('NONE');
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleNavClick = (tab: LandingTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: "What is AnveshakSutra and how do I use it?",
      a: "AnveshakSutra is a next-generation Zero-Knowledge Threat Intelligence and Personal Digital Safety platform. You can use it in two ways: 1) Easy Personal Mode to check if your personal email, phone number, Instagram, or passwords were leaked in major breaches (like the boAt 7.5M leak or Google Dark Web catalogs) with 1-click step-by-step fix guides; 2) Developer & SOC Mode to run 3D entity relationship graph mapping, deploy canary honey-tokens, and scan git repositories with the official CLI."
    },
    {
      q: "Is it safe to check my real email or password here?",
      a: "Yes, 100% safe. AnveshakSutra implements mathematical k-Anonymity (k=5) and client-side RAM hashing. When you search, your browser calculates a SHA-256 hash locally in memory and only sends the first 5 characters (e.g. '00093') to the server. Your actual email or password is NEVER transmitted over the wire or stored on any server."
    },
    {
      q: "Is AnveshakSutra free to use?",
      a: "Yes! AnveshakSutra is 100% free and open-source. It leverages open public threat intelligence APIs (such as XposedOrNot and Cloudflare's Pwned Passwords range engine) and pre-indexed dark web catalogs with zero paid subscriptions or credit card requirements."
    },
    {
      q: "What major breaches are covered in the search?",
      a: "The engine indexes over 3.28+ billion historical and recent breach records, including the boAt Lifestyle 7.5M Customer Data Leak (April 2024), Google Dark Web Report historical archives, Naz.API 70.8M Infostealer combolists, RedLine/Lumma malware dumps, and COMB archives."
    },
    {
      q: "How does the Developer CLI work?",
      a: "The CLI allows developers to run automated repository scans for leaked API keys, tokens, and credentials right inside their terminal or CI/CD pipelines. It includes Shannon entropy scanners and autonomous canary decoy deployers."
    }
  ];

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
            onClick={() => handleNavClick('HOW_IT_WORKS')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'HOW_IT_WORKS' ? 'text-white font-semibold border-b border-white' : 'hover:text-white'
            }`}
          >
            How to Use
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

          {/* Mobile Hamburger Button */}
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
              onClick={() => handleNavClick('HOW_IT_WORKS')}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-emerald-400 active:bg-white/10"
            >
              📖 How to Use
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
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-left text-purple-400 active:bg-white/10 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Download CLI</span>
            </button>
            <button
              onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
              className="col-span-2 p-3 rounded-xl bg-white text-black font-bold text-left active:bg-neutral-200 flex items-center justify-between"
            >
              <span>Operator SOC Console</span>
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
        {/* PAGE: HOW TO USE & PLATFORM GUIDE (ABOUT & USE CASES)                     */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'HOW_IT_WORKS' && (
          <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 max-w-6xl mx-auto space-y-12 animate-fadeIn">
            {/* Header */}
            <div className="space-y-3 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>COMPLETE PLATFORM &amp; USER GUIDE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
                About AnveshakSutra &amp; How to Use It
              </h1>
              <p className="text-sm sm:text-base text-[#a8a89f] leading-relaxed">
                AnveshakSutra bridges the gap between everyday digital safety for families and mathematical, defense-grade threat intelligence for security engineers.
              </p>
            </div>

            {/* 3-Step Quick Start Guide */}
            <div className="bg-[#1c1c1a] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">3-STEP WORKFLOW</span>
                <h2 className="text-2xl font-bold text-white">How It Works in 3 Simple Steps</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#131312] border border-white/5 space-y-3 relative">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
                    1
                  </div>
                  <h3 className="text-base font-bold text-white">Enter an Identifier</h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Type your Gmail/email address, phone number, Instagram handle, or a password into the Personal Safety Scanner.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded-lg">
                    🔒 Hashed locally in browser RAM via SHA-256.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#131312] border border-white/5 space-y-3 relative">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
                    2
                  </div>
                  <h3 className="text-base font-bold text-white">Zero-Knowledge Sweep</h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    The platform cross-checks over 3.2B records across dark-web catalogs (including the boAt 7.5M leak, Naz.API, and Google Dark Web indices) using only 5-character prefix queries.
                  </p>
                  <div className="text-[11px] font-mono text-purple-400 bg-purple-500/10 p-2 rounded-lg">
                    ⚡ Server never learns your identity.
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#131312] border border-white/5 space-y-3 relative">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm font-mono">
                    3
                  </div>
                  <h3 className="text-base font-bold text-white">Fix &amp; Protect</h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Review your 0–100 Safety Score, see exactly what leaked (passwords, addresses, phone numbers), and follow plain-English 1-click remediation guides.
                  </p>
                  <div className="text-[11px] font-mono text-amber-400 bg-amber-500/10 p-2 rounded-lg">
                    🛡️ 1-Click Password Generator &amp; Watchlist.
                  </div>
                </div>
              </div>
            </div>

            {/* Who is it for? 3 Persona Cards */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-purple-400 uppercase font-bold tracking-wider">TAILORED USE CASES</span>
                <h2 className="text-2xl font-bold text-white">Who Is AnveshakSutra For?</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Persona 1 */}
                <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-emerald-500/30 space-y-4 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">1. Everyday Users &amp; Families</h3>
                  <ul className="space-y-2 text-xs text-[#a8a89f]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Check if your personal Gmail or phone number was leaked in the boAt or Naz.API breaches.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Generate uncrackable passwords and monitor parents/kids on a single family watchlist.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Ask everyday questions to the AI Security Copilot in plain English.</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleNavClick('PERSONAL_SAFETY')}
                    className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Open Personal Safety Guard
                  </button>
                </div>

                {/* Persona 2 */}
                <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-purple-500/30 space-y-4 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">2. Software Developers</h3>
                  <ul className="space-y-2 text-xs text-[#a8a89f]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Install the CLI to scan git commits for hardcoded AWS, Stripe, and SSH keys.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Shannon entropy analysis ($H(X)$) to spot random secrets before they are pushed to GitHub.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Plant Honey-Canaries in staging environments to catch unauthorized clones.</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setIsCliModalOpen(true)}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Download Developer CLI
                  </button>
                </div>

                {/* Persona 3 */}
                <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-rose-500/30 space-y-4 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">3. Security Operators &amp; CISOs</h3>
                  <ul className="space-y-2 text-xs text-[#a8a89f]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>3D Cyber DNA™ Graph visualizer to map lateral attack paths and Single Points of Failure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>Damage Control Center with live HTTP 401 active credential verification probes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>Export cryptographic SHA-256 sealed Security Exposure Audit Reports.</span>
                    </li>
                  </ul>
                  <button
                    onClick={onSignIn}
                    className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Launch Operator Console
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-[#1c1c1a] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="text-2xl font-bold text-white">Everything You Need to Know</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-white/10 rounded-2xl bg-[#131312] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-white cursor-pointer hover:bg-white/5 transition-colors gap-3"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#8e928e] shrink-0" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#a8a89f] leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
                  onClick={() => handleNavClick('HOW_IT_WORKS')}
                  className="w-full sm:w-auto bg-[#1c1c1a]/80 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>How to Use</span>
                </button>

                <button
                  onClick={() => setIsCliModalOpen(true)}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-[11px] font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Get CLI</span>
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
                    Designed for everyday users. Check if your phone number, Instagram, or passwords were leaked in the boAt 7.5M or Naz.API breaches.
                  </p>
                </div>

                {/* Pillar 1: How to Use & Platform Guide */}
                <div 
                  onClick={() => handleNavClick('HOW_IT_WORKS')}
                  className="bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 sm:p-7 space-y-2.5 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#242422] flex items-center justify-center text-purple-400 border border-white/10 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                    <span>How to Use</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
                  </h3>
                  <p className="text-xs text-[#8e928e] leading-relaxed">
                    Explore use cases for everyday families, software engineers, and SOC operators with a 3-step quick start guide.
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
                  onClick={() => handleNavClick('HOW_IT_WORKS')}
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
