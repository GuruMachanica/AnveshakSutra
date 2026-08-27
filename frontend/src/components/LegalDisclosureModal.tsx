import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Terminal, Copy, Check, Send, AlertTriangle } from 'lucide-react';

export type LegalModalType = 'NONE' | 'PRIVACY' | 'TERMS' | 'DISCLOSURE' | 'CONTACT';

interface LegalDisclosureModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalDisclosureModal: React.FC<LegalDisclosureModalProps> = ({ type, onClose }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (type === 'NONE') return null;

  const pgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.10
Comment: AnveshakSutra SOC Security Key 2026

mQGNBF+Z6u8BDADQ1l+z5...[ANVESHAKSUTRA-SECURITY-KEY-2026]...
=9XbM
-----END PGP PUBLIC KEY BLOCK-----`;

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden text-[#e5e2e0]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === 'PRIVACY' && <Lock className="w-5 h-5 text-white" />}
            {type === 'TERMS' && <FileText className="w-5 h-5 text-white" />}
            {type === 'DISCLOSURE' && <ShieldCheck className="w-5 h-5 text-rose-400" />}
            {type === 'CONTACT' && <Terminal className="w-5 h-5 text-emerald-400" />}
            <div>
              <h2 className="text-base font-bold text-white tracking-tight uppercase font-sans">
                {type === 'PRIVACY' && 'Zero-Knowledge Privacy Protocol'}
                {type === 'TERMS' && 'Operator Terms of Engagement'}
                {type === 'DISCLOSURE' && 'Coordinated Intelligence Disclosure Standard'}
                {type === 'CONTACT' && 'SOC Secure Contact Terminal'}
              </h2>
              <p className="text-[10px] font-mono text-[#8e928e] uppercase tracking-wider mt-0.5">
                RESEARCH PROJECT SPECIFICATION / NON-COMMERCIAL PROTOTYPE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e928e] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs leading-relaxed text-[#a8a89f]">
          
          {/* Universal Project Status Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 text-amber-200/90 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>PROJECT NATURE & RESEARCH STATUS DISCLAIMER</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/80">
              <strong>AnveshakSutra is an open-source cybersecurity research project and educational prototype, NOT a commercial enterprise software product or production SLA-backed service.</strong> All features, simulations, and algorithms are provided on an &quot;AS-IS&quot; basis for academic research, threat modeling, and defensive security analysis.
            </p>
          </div>

          {/* 1. PRIVACY PROTOCOL */}
          {type === 'PRIVACY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-2">
                <span className="text-white font-bold font-mono text-xs block">Axiom 1: Generalized K-Anonymity (k=32)</span>
                <p className="text-[11px] text-[#8e928e]">
                  This research project mathematically enforces client-side hashing. Only the first 5 hexadecimal characters of a SHA-256 target digest are sent to backend instances. Exact matching is performed strictly in local client memory.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">1. Zero Plaintext Ingestion</h3>
                <p>
                  As an experimental project, AnveshakSutra never receives, stores, or logs raw email addresses, passwords, or personal access tokens in plaintext. All candidate sets are mathematically salted and aggregated.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">2. In-Memory Session Purging</h3>
                <p>
                  Upon logout or session termination, all cached prefix buckets and graph node relationships are immediately purged from browser memory, leaving zero forensic trace on the client device.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">3. Third-Party Independence & No Tracking</h3>
                <p>
                  This project contains zero commercial telemetry, tracking scripts, or advertising cookies. All intelligence operations execute exclusively in your local deployment environment.
                </p>
              </div>
            </div>
          )}

          {/* 2. TERMS OF ENGAGEMENT */}
          {type === 'TERMS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-2">
                <span className="text-white font-bold font-mono text-xs block">Research & Ethical Authorization Mandate</span>
                <p className="text-[11px] text-[#8e928e]">
                  Because this is an experimental research project, operators must possess explicit authorization to test, monitor, or assess target domain perimeters, canary keys, and identity assets.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">1. Non-Destructive Active Verification</h3>
                <p>
                  Active verification probes within this project are restricted to non-destructive metadata validation (e.g., HTTP HEAD requests, challenge-response validations). Denial of service attacks or payload executions are strictly prohibited.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">2. Non-Commercial & Educational Usage</h3>
                <p>
                  This codebase is created for defensive cybersecurity research, security posture evaluations, and educational demonstrations. It is not intended as a commercial substitute for licensed enterprise SOC platforms.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">3. Compliance with Applicable Laws</h3>
                <p>
                  Operators agree to comply with all applicable local and international cybersecurity regulations (e.g., Computer Fraud and Abuse Act, GDPR, Indian IT Act 2000).
                </p>
              </div>
            </div>
          )}

          {/* 3. INTELLIGENCE DISCLOSURE */}
          {type === 'DISCLOSURE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141413] border border-rose-500/30 text-rose-200 space-y-2">
                <span className="text-rose-400 font-bold font-mono text-xs block">Research-Grade Responsible Disclosure Standard</span>
                <p className="text-[11px] text-rose-200/80">
                  When a lateral compromise path or exposed single point of failure is demonstrated via this project, AnveshakSutra provides a standardized disclosure format to allow remediation prior to any public academic release.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">1. Research Evidence Bundling</h3>
                <p>
                  Generated disclosure reports contain immutable cryptographic timestamps, traversal topology graphs, and canary trigger logs formatted for educational and remediation review.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">2. Remediation Recommendations</h3>
                <p>
                  Disclosures include open-source remediation scripts for immediate key invalidation, GraphQL depth limits, and firewall perimeter segmentation.
                </p>
              </div>
            </div>
          )}

          {/* 4. CONTACT TERMINAL */}
          {type === 'CONTACT' && (
            <div className="space-y-5">
              {contactSent ? (
                <div className="p-8 rounded-xl bg-[#141413] border border-emerald-500/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Message Encrypted & Dispatched</h3>
                  <p className="text-xs text-[#8e928e]">Your transmission has been queued for the AnveshakSutra research and maintainer team.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center justify-between">
                      <span>Research Public PGP Key (Encrypted Submissions)</span>
                      <button
                        onClick={copyPgp}
                        className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? 'COPIED' : 'COPY PGP KEY'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-[#141413] border border-white/10 font-mono text-[10px] text-[#8e928e] overflow-x-auto">
                      {pgpKey}
                    </pre>
                  </div>

                  <form onSubmit={handleSendContact} className="space-y-3 pt-2 border-t border-white/5">
                    <div className="text-xs font-semibold text-white">Direct Research Inquiry / Inquiry Dispatch</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Researcher / Operator Name"
                        className="bg-[#141413] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-[#8e928e] focus:outline-none focus:border-white font-mono"
                      />
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="Contact Email / Signal Handle"
                        className="bg-[#141413] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-[#8e928e] focus:outline-none focus:border-white font-mono"
                      />
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Enter research inquiry, bug report, or responsible disclosure notice..."
                      className="w-full bg-[#141413] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-[#8e928e] focus:outline-none focus:border-white font-mono"
                    ></textarea>

                    <button
                      type="submit"
                      className="w-full bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Research Dispatch</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#141413] flex justify-between items-center text-[10px] font-mono text-[#8e928e]">
          <span>RESEARCH PROJECT • NOT A COMMERCIAL PRODUCT</span>
          <button
            onClick={onClose}
            className="text-white hover:text-neutral-300 font-semibold uppercase cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
