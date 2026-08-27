import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, UserCheck, Code, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenSafety: () => void;
  onOpenCli: () => void;
  onSignIn: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenSafety,
  onOpenCli,
  onSignIn,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

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
          <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-emerald-500/30 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Everyday Users &amp; Families</h3>
              <ul className="space-y-2 text-xs text-[#a8a89f]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Check if your personal Gmail or phone was leaked in the boAt or Naz.API breaches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Generate uncrackable passwords and monitor parents/kids on a family watchlist.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ask everyday questions to the AI Security Copilot in plain English.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenSafety}
              className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer mt-4"
            >
              Open Personal Safety Guard
            </button>
          </div>

          {/* Persona 2 */}
          <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-purple-500/30 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
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
                  <span>Shannon entropy analysis ($H(X)$) to spot random secrets before push.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Plant Honey-Canaries in staging environments to catch unauthorized clones.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenCli}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer mt-4"
            >
              Download Developer CLI
            </button>
          </div>

          {/* Persona 3 */}
          <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-rose-500/30 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Security Operators &amp; CISOs</h3>
              <ul className="space-y-2 text-xs text-[#a8a89f]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>3D Cyber DNA™ Graph visualizer to map lateral attack paths and SPOFs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Damage Control Center with live HTTP 401 active verification probes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Export cryptographic SHA-256 sealed Security Exposure Audit Reports.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onSignIn}
              className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer mt-4"
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
  );
};
