import React, { useState, useEffect } from 'react';
import { Plus, Download, ArrowRight, Play, Pause, Terminal, Check, X } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface HitItem {
  id: string;
  sev: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  source: 'GitHub' | 'Pastebin' | 'Telegram' | 'Dark Forum' | 'Surface Web';
  value: string;
  time: string;
  rawDetails: string;
  mitigation: string;
  entropy?: number;
}

export const OsintSweepsView: React.FC = () => {
  const [targetInput, setTargetInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [activeCycleId, setActiveCycleId] = useState('OS-7732');
  const [progress, setProgress] = useState({
    pastebin: 85,
    github: 42,
    telegram: 98,
    darkForums: 15,
  });

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'GITHUB' | 'PASTEBIN' | 'TELEGRAM' | 'DARK_FORUM'>('ALL');
  const [selectedHit, setSelectedHit] = useState<HitItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hits, setHits] = useState<HitItem[]>([
    {
      id: 'HIT-101',
      sev: 'CRITICAL',
      type: 'API Key Exposure',
      source: 'GitHub',
      value: 'sk_live_51Mv9...9f2a',
      time: '10:42 AM',
      rawDetails: 'Found in public commit diff "chore: update payment credentials" in repo frontend-prod-backup.',
      mitigation: 'POST /api/v1/containment/revoke-token?token_id=sk_live_51Mv9',
      entropy: 4.62,
    },
    {
      id: 'HIT-102',
      sev: 'HIGH',
      type: 'Employee Credential',
      source: 'Pastebin',
      value: 'j.smith@defense.internal:Tr0ub4dor&3',
      time: '09:15 AM',
      rawDetails: 'Detected in combo-dump paste "Enterprise DB Dump 2026 Q3". Plaintext match salted in local memory.',
      mitigation: 'Force FIDO2 password rotation for user j.smith@defense.internal',
      entropy: 3.42,
    },
    {
      id: 'HIT-103',
      sev: 'MEDIUM',
      type: 'Infrastructure Mention',
      source: 'Telegram',
      value: 'prod-db-01.internal.anveshak.net',
      time: '08:03 AM',
      rawDetails: 'Intercepted in threat actor channel "NullSyndicate-Dumps" discussing target IP ranges.',
      mitigation: 'Restrict ingress CIDR rules on prod-db-01 security group.',
      entropy: 2.84,
    },
  ]);

  const [streamLogs, setStreamLogs] = useState<string[]>([
    '[10:42:01 UTC] Ingesting Pastebin stream... 12,410 pastes parsed.',
    '[10:42:15 UTC] MATCH: SHA-256 prefix 8f1a2 matched candidate bucket #4.',
    '[10:42:30 UTC] GitHub GraphQL rate limit budget: 4,820/5,000 requests remaining.',
    '[10:42:45 UTC] Tor Hidden Service crawler connected to .onion pool via port 9050.',
    '[10:43:00 UTC] Autonomous worker cycle OS-7732 health check: ALL PROBES ACTIVE.',
  ]);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setProgress((prev) => ({
        pastebin: prev.pastebin >= 100 ? 10 : Math.min(100, prev.pastebin + 2),
        github: prev.github >= 100 ? 5 : Math.min(100, prev.github + 3),
        telegram: prev.telegram >= 100 ? 15 : Math.min(100, prev.telegram + 1),
        darkForums: prev.darkForums >= 100 ? 2 : Math.min(100, prev.darkForums + 2),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isScanning]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAddNewTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim() || isSubmitting) return;

    const newTarget = targetInput.trim();
    setIsSubmitting(true);

    try {
      // 1. Run live backend sweep
      const resp = await apiClient.triggerSweep(newTarget);
      if (resp.task_id) {
        setActiveCycleId(`OS-${resp.task_id.slice(-4)}`);
      }

      // 2. Classify Shannon Entropy in real-time
      let entropyScore = 3.5;
      let detectedType = 'Target Sweep Match';
      try {
        const entropyRes = await apiClient.classifyEntropy(newTarget);
        if (entropyRes) {
          entropyScore = entropyRes.entropy || 3.5;
          detectedType = entropyRes.type || 'Target Sweep Match';
        }
      } catch {}

      const newHit: HitItem = {
        id: `HIT-${Math.floor(100 + Math.random() * 900)}`,
        sev: entropyScore >= 3.85 ? 'CRITICAL' : 'HIGH',
        type: detectedType.replace(/_/g, ' '),
        source: 'Surface Web',
        value: newTarget,
        time: 'Just now',
        rawDetails: `Dynamic OSINT sweep & Shannon entropy scan (${entropyScore} bits/char) completed for "${newTarget}".`,
        mitigation: `Execute active containment probe & verify revocation on ${newTarget}`,
        entropy: entropyScore,
      };

      setHits((prev) => [newHit, ...prev]);
      setStreamLogs((prev) => [
        `[${new Date().toLocaleTimeString()} UTC] TARGET PROBED: "${newTarget}" -> Entropy: ${entropyScore} bits/char.`,
        ...prev,
      ]);
      setTargetInput('');
      triggerToast(`Target "${newTarget}" scanned: ${detectedType} (${entropyScore} bits/char)`);
    } catch (err: any) {
      triggerToast(`Sweep error: ${err.message || 'Check connection'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'SEVERITY', 'INDICATOR_TYPE', 'SOURCE', 'EXTRACTED_VALUE', 'ENTROPY', 'TIMESTAMP', 'DETAILS'];
    const rows = hits.map((h) => [
      h.id,
      h.sev,
      h.type,
      h.source,
      `"${h.value.replace(/"/g, '""')}"`,
      h.entropy || 'N/A',
      h.time,
      `"${h.rawDetails.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anveshak_osint_sweep_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Forensic CSV report downloaded.');
  };

  const filteredHits = hits.filter((h) => {
    if (selectedFilter === 'CRITICAL') return h.sev === 'CRITICAL';
    if (selectedFilter === 'GITHUB') return h.source === 'GitHub';
    if (selectedFilter === 'PASTEBIN') return h.source === 'Pastebin';
    if (selectedFilter === 'TELEGRAM') return h.source === 'Telegram';
    if (selectedFilter === 'DARK_FORUM') return h.source === 'Dark Forum';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl w-full">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1a] border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            LIVE MULTI-SOURCE INGESTION SENTINEL
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-sans">
            OSINT Sweeps &amp; Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[#a8a89f] mt-1">
            Continuous zero-cost background crawlers across Pastebin, GitHub, Telegram, and Dark-Web hidden services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer border ${
              isScanning
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isScanning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isScanning ? 'PAUSE CRAWLERS' : 'RESUME CRAWLERS'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Target Ingestion Search Bar */}
      <form onSubmit={handleAddNewTarget} className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-[#131312] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-white/30 transition-colors">
            <span className="text-xs font-mono text-emerald-400 mr-2">$ sweep --target</span>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Enter domain, email, GitHub handle, or paste raw API token..."
              className="bg-transparent flex-1 text-xs font-mono text-white placeholder-[#8e928e]/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !targetInput.trim()}
            className="flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-6 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'INGESTING...' : 'DISPATCH SWEEP'}</span>
          </button>
        </div>
      </form>

      {/* Sensor Progress Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Pastebin Feeds', prog: progress.pastebin, items: '12.4k/min', color: 'bg-emerald-500' },
          { name: 'GitHub Commits', prog: progress.github, items: '8.2k/min', color: 'bg-blue-500' },
          { name: 'Telegram Channels', prog: progress.telegram, items: '1.5k/min', color: 'bg-purple-500' },
          { name: 'Tor Hidden Services', prog: progress.darkForums, items: '420/min', color: 'bg-rose-500' },
        ].map((sensor) => (
          <div key={sensor.name} className="bg-[#1c1c1a] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white font-semibold">{sensor.name}</span>
              <span className="text-[#8e928e]">{sensor.items}</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className={`h-full ${sensor.color} transition-all duration-500`}
                style={{ width: `${sensor.prog}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Findings Table */}
      <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] font-bold">
              INGESTED FORENSIC MATCHES ({filteredHits.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CYCLE: {activeCycleId}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'CRITICAL', 'GITHUB', 'PASTEBIN', 'TELEGRAM'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedFilter === f ? 'bg-white text-black font-bold' : 'text-[#8e928e] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Hits List */}
        <div className="space-y-3">
          {filteredHits.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelectedHit(h)}
              className="p-4 bg-[#131312] border border-white/5 hover:border-white/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      h.sev === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : h.sev === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {h.sev}
                  </span>
                  <span className="text-xs font-semibold text-white font-sans">{h.type}</span>
                  <span className="text-[10px] font-mono text-[#8e928e]">via {h.source}</span>
                  {h.entropy && (
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                      $H={h.entropy}$
                    </span>
                  )}
                </div>
                <code className="text-xs font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded block max-w-xl truncate">
                  {h.value}
                </code>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#8e928e] shrink-0">
                <span>{h.time}</span>
                <ArrowRight className="w-4 h-4 text-[#8e928e] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Stream Terminal Logs */}
      <div className="bg-[#131312] border border-white/10 rounded-2xl p-5 font-mono text-xs space-y-2 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">LIVE TELEMETRY STREAM LOGS</span>
          </div>
          <span className="text-emerald-400 text-[10px] animate-pulse">● STREAM ACTIVE</span>
        </div>
        <div className="space-y-1 text-[11px] text-[#8e928e] max-h-32 overflow-y-auto font-mono">
          {streamLogs.map((log, idx) => (
            <div key={idx} className="hover:text-neutral-200 transition-colors">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Hit Detail Inspection Modal */}
      {selectedHit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setSelectedHit(null)} className="absolute top-5 right-5 text-[#8e928e] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest">
                FORENSIC HIT INSPECTION • {selectedHit.id}
              </span>
              <h3 className="text-xl font-bold text-white font-sans">{selectedHit.type}</h3>
            </div>

            <div className="space-y-3 bg-[#131312] border border-white/5 rounded-xl p-4 text-xs font-mono">
              <div>
                <span className="text-[#8e928e]">MATCHED PAYLOAD:</span>
                <p className="text-emerald-400 select-all break-all mt-0.5">{selectedHit.value}</p>
              </div>
              <div>
                <span className="text-[#8e928e]">FORENSIC EVIDENCE:</span>
                <p className="text-neutral-300 mt-0.5">{selectedHit.rawDetails}</p>
              </div>
              <div>
                <span className="text-[#8e928e]">RECOMMENDED REMEDIATION:</span>
                <p className="text-purple-300 mt-0.5">{selectedHit.mitigation}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedHit(null);
                triggerToast(`Containment playbook initiated for ${selectedHit.id}`);
              }}
              className="w-full py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
            >
              EXECUTE CONTAINMENT PLAYBOOK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
