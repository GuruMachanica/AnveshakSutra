import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShoppingBag, ShieldAlert } from 'lucide-react';

export interface BreachFinding {
  id: string;
  breach_name: string;
  leak_source: string;
  compromised_fields: string[];
  breach_date: string;
  severity: string;
  risk_score: number;
  raw_snippet: string;
  recommended_actions: string[];
}

export interface ScanResultSummary {
  status: 'IDLE' | 'SAFE' | 'EXPOSED';
  score: number;
  title: string;
  details: string;
}

interface BreachResultsViewProps {
  summary: ScanResultSummary;
  findings: BreachFinding[];
}

export const BreachResultsView: React.FC<BreachResultsViewProps> = ({ summary, findings }) => {
  if (summary.status === 'IDLE') return null;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto animate-fadeIn">
      {/* Header Score Card */}
      <div
        className={`p-4 sm:p-8 rounded-2xl border transition-all ${
          summary.status === 'SAFE'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 shadow-emerald-950/30'
            : 'bg-rose-950/20 border-rose-500/40 text-rose-300 shadow-rose-950/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {summary.status === 'SAFE' ? (
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white font-sans">{summary.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">{summary.details}</p>
            </div>
          </div>

          <div className="bg-[#131312] border border-white/10 rounded-2xl p-3 sm:p-4 text-center shrink-0 min-w-[100px] sm:min-w-[120px] self-start sm:self-center">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8e928e] font-mono font-bold">SAFETY SCORE</div>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-0.5 ${summary.status === 'SAFE' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {summary.score}/100
            </div>
          </div>
        </div>
      </div>

      {/* Individual Breach Finding Cards */}
      {findings.map((finding, idx) => (
        <div key={idx} className="p-4 sm:p-6 rounded-2xl bg-[#131312] border border-rose-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                {finding.breach_name.toLowerCase().includes('boat') ? <ShoppingBag className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">{finding.breach_name}</h4>
                <p className="text-[11px] sm:text-xs text-amber-300 font-mono mt-0.5">
                  {finding.breach_date}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 self-start sm:self-auto">
              {finding.severity} RISK
            </span>
          </div>

          {/* Compromised Fields */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold text-[#8e928e] uppercase">
              Compromised Categories:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {finding.compromised_fields.map((field, fIdx) => (
                <span key={fIdx} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[11px] font-medium text-rose-300">
                  ⚠️ {field}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Fixes */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recommended Immediate Steps:</span>
            </div>
            <ul className="space-y-1 text-xs text-neutral-300">
              {finding.recommended_actions.map((act, aIdx) => (
                <li key={aIdx} className="flex items-start gap-2 bg-[#1c1c1a] p-2 sm:p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
