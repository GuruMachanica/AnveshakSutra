import React from 'react';
import { LegalModalType } from '../LegalDisclosureModal';

interface LandingFooterProps {
  onOpenLegal: (type: LegalModalType) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="border-t border-white/10 px-4 sm:px-12 md:px-16 lg:px-20 py-6 bg-[#0e0e0d] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8e928e] font-mono text-center sm:text-left">
      <div>
        © 2026 AnveshakSutra. Zero-Knowledge Threat Intelligence.
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5">
        <button onClick={() => onOpenLegal('PRIVACY')} className="hover:text-white transition-colors cursor-pointer">
          Privacy Policy
        </button>
        <button onClick={() => onOpenLegal('TERMS')} className="hover:text-white transition-colors cursor-pointer">
          Terms of Service
        </button>
        <button onClick={() => onOpenLegal('DISCLOSURE')} className="hover:text-white transition-colors cursor-pointer">
          Security Disclosures
        </button>
      </div>
    </footer>
  );
};
