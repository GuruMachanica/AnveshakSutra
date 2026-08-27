import React from 'react';

export const ExposureReportsView: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-12 md:px-16 lg:px-20 w-full space-y-8 animate-fadeIn">
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
  );
};
