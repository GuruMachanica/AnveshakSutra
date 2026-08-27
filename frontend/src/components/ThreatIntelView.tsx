import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, ArrowUpRight, Globe, X, RefreshCw, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';
import { apiClient, ThreatIncident } from '../services/apiClient';

interface ThreatActor {
  id: string;
  name: string;
  status: 'HIGH THREAT' | 'MONITORING' | 'DORMANT';
  desc: string;
  tags: string[];
  statusColor: string;
  cves: string[];
  mitreTechniques: string[];
  targetedSectors: string[];
  lastActive: string;
  iocs: string[];
}

export const ThreatIntelView: React.FC = () => {
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);
  const [incidents, setIncidents] = useState<ThreatIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSweeping, setIsSweeping] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const threatActors: ThreatActor[] = [
    {
      id: 'TA-1',
      name: 'NullSyndicate',
      status: 'HIGH THREAT',
      desc: 'Known for targeting financial and defense infrastructure using zero-day CI/CD pipeline exploits and dark forum credential dumps.',
      tags: ['Finance', 'Phishing', 'CI/CD Exfil'],
      statusColor: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
      cves: ['CVE-2024-3094', 'CVE-2023-4863', 'CVE-2024-21626'],
      mitreTechniques: ['T1552 (Unsecured Credentials)', 'T1190 (Exploit Public-Facing App)', 'T1078 (Valid Accounts)'],
      targetedSectors: ['Financial Services', 'Defense Tech', 'Cloud DevOps'],
      lastActive: '12 mins ago',
      iocs: ['185.220.101.5', 'api.nullsyndicate-relay.org', 'SHA256: 8f1a23c89b...'],
    },
    {
      id: 'TA-2',
      name: 'SilentVoid',
      status: 'MONITORING',
      desc: 'Focuses on prolonged espionage, credential stuffing, and data exfiltration from technology sector staging repositories.',
      tags: ['Tech', 'APT', 'Lateral Movement'],
      statusColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
      cves: ['CVE-2023-38606', 'CVE-2024-6387'],
      mitreTechniques: ['T1021 (Remote Services)', 'T1555 (Credentials from Password Stores)'],
      targetedSectors: ['SaaS Providers', 'Semiconductors', 'Telecom'],
      lastActive: '3 hours ago',
      iocs: ['194.26.29.112', 'telecom-auth-probe.net'],
    },
    {
      id: 'TA-3',
      name: 'CrimsonGhost',
      status: 'DORMANT',
      desc: 'Historically targeted healthcare and biomedical databases with ransomware. No significant active command-and-control in last 90 days.',
      tags: ['Healthcare', 'Ransomware'],
      statusColor: 'text-[#8e928e] bg-[#20201e] border-white/10',
      cves: ['CVE-2021-34527', 'CVE-2022-30190'],
      mitreTechniques: ['T1486 (Data Encrypted for Impact)', 'T1489 (Service Stop)'],
      targetedSectors: ['Healthcare', 'Biomedical Labs'],
      lastActive: '92 days ago',
      iocs: ['45.154.255.88', 'ghost-recovery-portal.onion'],
    },
  ];

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const liveIncidents = await apiClient.getIncidents();
      setIncidents(liveIncidents);
    } catch {
      console.log('Using local fallback for incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResolveIncident = async (id: string) => {
    try {
      await apiClient.resolveIncident(id);
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVED', isCritical: false } : inc))
      );
      showToast('Incident marked as Resolved & Verified.');
    } catch {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVED', isCritical: false } : inc))
      );
      showToast('Incident resolved locally.');
    }
  };

  const handleDeleteIncident = async (id: string) => {
    try {
      await apiClient.deleteIncident(id);
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
      showToast('Incident removed from active radar.');
    } catch {
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
      showToast('Incident removed locally.');
    }
  };

  const handleTriggerSweep = async () => {
    setIsSweeping(true);
    try {
      await apiClient.triggerSweep('enterprise-perimeter');
      showToast('Async Threat Intel sweep enqueued. Monitoring in background.');
      await loadIncidents();
    } catch {
      showToast('Sweep triggered.');
    } finally {
      setIsSweeping(false);
    }
  };

  const filteredIncidents = criticalOnly
    ? incidents.filter((e) => e.isCritical || e.severity === 'CRITICAL')
    : incidents;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl w-full">
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1a] border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] flex items-center gap-1.5 font-bold">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            GLOBAL THREAT INTELLIGENCE RADAR
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-sans">
            Threat Intelligence Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#a8a89f] mt-1">
            Global exposure telemetry, actor profiling, and 0-day exploitation tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSweep}
            disabled={isSweeping}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : ''}`} />
            <span>{isSweeping ? 'SWEEPING...' : 'TRIGGER SWEEP'}</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>LIVE SOC SYNC ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Global Leak Map (Col-8) + Real-Time Exposure (Col-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Global Leak Map Card */}
        <div className="lg:col-span-8 bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-xl">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e] font-mono">
              GLOBAL EXPOSURE TOPOLOGY MAP
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#131312] border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setMapZoom((prev) => Math.min(prev + 0.25, 2))}
                className="p-1 text-[#8e928e] hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMapZoom((prev) => Math.max(prev - 0.25, 0.75))}
                className="p-1 text-[#8e928e] hover:text-white hover:bg-white/5 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive World Grid Representation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div
              className="w-full h-full border border-dashed border-white/20 rounded-full scale-150 transition-transform duration-500"
              style={{ transform: `scale(${mapZoom * 1.2})` }}
            ></div>
          </div>

          {/* Realistic Pins */}
          <div
            className="relative w-full h-[280px] my-auto transition-transform duration-300"
            style={{ transform: `scale(${mapZoom})` }}
          >
            {/* Pin 1: North America */}
            <div
              onClick={() => setSelectedPin('NA')}
              className="absolute top-[25%] left-[22%] cursor-pointer group pointer-events-auto"
            >
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute"></div>
              <div className="w-3 h-3 rounded-full bg-rose-500 relative border border-white/40"></div>
              <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#131312] border border-white/20 text-[10px] font-mono text-white px-2 py-1 rounded whitespace-nowrap z-20 shadow-xl">
                US-East (AWS Staging Leak)
              </div>
            </div>

            {/* Pin 2: Western Europe */}
            <div
              onClick={() => setSelectedPin('EU')}
              className="absolute top-[32%] left-[48%] cursor-pointer group pointer-events-auto"
            >
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping absolute"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500 relative border border-white/40"></div>
              <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#131312] border border-white/20 text-[10px] font-mono text-white px-2 py-1 rounded whitespace-nowrap z-20 shadow-xl">
                Frankfurt (Pastebin Recon)
              </div>
            </div>

            {/* Pin 3: Asia Pacific */}
            <div
              onClick={() => setSelectedPin('APAC')}
              className="absolute top-[50%] left-[78%] cursor-pointer group pointer-events-auto"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative border border-white/40"></div>
              <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#131312] border border-white/20 text-[10px] font-mono text-white px-2 py-1 rounded whitespace-nowrap z-20 shadow-xl">
                Singapore (Canary Tripwire Armed)
              </div>
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="flex justify-between items-center text-xs font-mono text-[#8e928e] border-t border-white/5 pt-4 z-10">
            <span>{selectedPin ? `FOCUS REGION: ${selectedPin} CLUSTER` : 'ACTIVE SENSORS: 48 NODE CLUSTERS'}</span>
            <span>LATENCY: 14ms (PIR ENCRYPTED)</span>
          </div>
        </div>

        {/* Real-Time Exposure Stream (Col-4) */}
        <div className="lg:col-span-4 bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8e928e] font-mono">
                REAL-TIME INCIDENT RADAR ({filteredIncidents.length})
              </span>
              <button
                onClick={() => setCriticalOnly(!criticalOnly)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  criticalOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-[#8e928e] border-white/10 hover:text-white'
                }`}
              >
                {criticalOnly ? 'CRITICAL ONLY' : 'SHOW ALL'}
              </button>
            </div>

            {/* Scrollable Exposure List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center text-xs font-mono text-[#8e928e] py-8 animate-pulse">
                  Syncing Incident Feed...
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="text-center text-xs font-mono text-[#8e928e] py-8">
                  No active threat incidents found. All perimeters clean.
                </div>
              ) : (
                filteredIncidents.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      exp.status === 'RESOLVED'
                        ? 'bg-black/20 border-white/5 opacity-60'
                        : exp.isCritical || exp.severity === 'CRITICAL'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-[#131312] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          exp.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : exp.isCritical || exp.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {exp.status === 'RESOLVED' ? 'RESOLVED' : exp.severity || exp.type}
                      </span>
                      <span className="text-[10px] font-mono text-[#8e928e]">{exp.time}</span>
                    </div>

                    <p className="text-xs font-semibold text-white font-sans truncate">{exp.title || exp.target}</p>
                    <p className="text-[11px] font-mono text-[#8e928e] truncate mt-0.5">{exp.source}</p>

                    {/* Action buttons */}
                    {exp.status !== 'RESOLVED' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleResolveIncident(exp.id)}
                          className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>RESOLVE</span>
                        </button>
                        <button
                          onClick={() => handleDeleteIncident(exp.id)}
                          className="p-1 text-[#8e928e] hover:text-rose-400 transition-colors ml-auto"
                          title="Dismiss Incident"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Threat Actor Profiling Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#8e928e] font-bold">
          Active Threat Actor Profiles ({threatActors.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {threatActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => setSelectedActor(actor)}
              className="bg-[#1c1c1a] border border-white/10 hover:border-white/30 rounded-2xl p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-sans">
                    {actor.name}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${actor.statusColor}`}>
                    {actor.status}
                  </span>
                </div>
                <p className="text-xs text-[#a8a89f] leading-relaxed line-clamp-3">{actor.desc}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {actor.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono bg-white/5 text-[#8e928e] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-[#8e928e]">
                  <span>Last Active: {actor.lastActive}</span>
                  <span className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Actor Detail Modal */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-6 right-6 text-[#8e928e] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white font-sans">{selectedActor.name}</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${selectedActor.statusColor}`}>
                  {selectedActor.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">{selectedActor.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#131312] border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e928e] font-bold">
                  MITRE ATT&amp;CK TACTICS
                </span>
                <ul className="space-y-1">
                  {selectedActor.mitreTechniques.map((t) => (
                    <li key={t} className="text-xs font-mono text-emerald-400">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#131312] border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e928e] font-bold">
                  INDICATORS OF COMPROMISE (IOCs)
                </span>
                <ul className="space-y-1">
                  {selectedActor.iocs.map((ioc) => (
                    <li key={ioc} className="text-xs font-mono text-rose-300">
                      • {ioc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
