import React from 'react';
import { Heart, ArrowUpRight, Terminal, HelpCircle } from 'lucide-react';

interface FeaturePillarsProps {
  onOpenSafety: () => void;
  onOpenHowItWorks: () => void;
  onOpenEntityMapping: () => void;
  onOpenCli: () => void;
}

export const FeaturePillars: React.FC<FeaturePillarsProps> = ({
  onOpenSafety,
  onOpenHowItWorks,
  onOpenEntityMapping,
  onOpenCli,
}) => {
  return (
    <section className="py-4 sm:py-6 px-4 sm:px-12 md:px-16 lg:px-20 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Pillar 0: Personal Safety Guard */}
        <div 
          onClick={onOpenSafety}
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
          onClick={onOpenHowItWorks}
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
          onClick={onOpenEntityMapping}
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
          onClick={onOpenCli}
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
  );
};
