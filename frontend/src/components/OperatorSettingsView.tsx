import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Bell, ShieldCheck, Lock, UserPlus, X, Check, Save } from 'lucide-react';

interface OperatorUser {
  id: string;
  name: string;
  email: string;
  role: string;
  clearance: string;
  status: 'ACTIVE' | 'REVOKED';
}

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export const OperatorSettingsView: React.FC = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'API' | 'NOTIF' | 'ACCESS' | 'HARDENING'>('API');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // API Integrations state
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(() => {
    try {
      const saved = localStorage.getItem('anveshak_endpoints');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'ThreatIntel Core API', url: 'api.threatintel.io/v2/ingest', isActive: true },
        { id: '2', name: 'Slack Security Webhook', url: 'hooks.slack.com/services/T00/B00/X00', isActive: false },
      ];
    } catch {
      return [
        { id: '1', name: 'ThreatIntel Core API', url: 'api.threatintel.io/v2/ingest', isActive: true },
        { id: '2', name: 'Slack Security Webhook', url: 'hooks.slack.com/services/T00/B00/X00', isActive: false },
      ];
    }
  });
  const [isNewEndpointOpen, setIsNewEndpointOpen] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState('');
  const [newEndpointUrl, setNewEndpointUrl] = useState('');

  // Notification Protocols state
  const [telegramActive, setTelegramActive] = useState(true);
  const [discordActive, setDiscordActive] = useState(true);
  const [pagerDutyActive, setPagerDutyActive] = useState(false);
  const [emailDigest, setEmailDigest] = useState<'instant' | 'daily' | 'weekly'>('instant');

  // User Access Control state
  const [operators, setOperators] = useState<OperatorUser[]>(() => {
    try {
      const saved = localStorage.getItem('anveshak_operators');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'System Administrator', email: 'admin@anveshaksutra.corp', role: 'Super Admin', clearance: 'Level 4', status: 'ACTIVE' },
        { id: '2', name: 'DevOps Lead', email: 'j.smith@anveshaksutra.corp', role: 'Operator', clearance: 'Level 3', status: 'ACTIVE' },
        { id: '3', name: 'Compliance Auditor', email: 'compliance@partner.io', role: 'Auditor (Read-Only)', clearance: 'Level 1', status: 'REVOKED' },
      ];
    } catch {
      return [
        { id: '1', name: 'System Administrator', email: 'admin@anveshaksutra.corp', role: 'Super Admin', clearance: 'Level 4', status: 'ACTIVE' },
        { id: '2', name: 'DevOps Lead', email: 'j.smith@anveshaksutra.corp', role: 'Operator', clearance: 'Level 3', status: 'ACTIVE' },
        { id: '3', name: 'Compliance Auditor', email: 'compliance@partner.io', role: 'Auditor (Read-Only)', clearance: 'Level 1', status: 'REVOKED' },
      ];
    }
  });
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Operator');
  const [inviteClearance, setInviteClearance] = useState('Level 2');

  // System Hardening state
  const [retentionPeriod, setRetentionPeriod] = useState<'7' | '30' | '90'>('7');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [zeroKnowledgeWipe, setZeroKnowledgeWipe] = useState(true);
  const [ipRateLimit, setIpRateLimit] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('anveshak_endpoints', JSON.stringify(endpoints));
  }, [endpoints]);

  useEffect(() => {
    localStorage.setItem('anveshak_operators', JSON.stringify(operators));
  }, [operators]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndpointName || !newEndpointUrl) return;

    const newEp: ApiEndpoint = {
      id: `EP-${Date.now()}`,
      name: newEndpointName,
      url: newEndpointUrl,
      isActive: true,
    };
    setEndpoints([...endpoints, newEp]);
    setNewEndpointName('');
    setNewEndpointUrl('');
    setIsNewEndpointOpen(false);
    showToast(`Integration "${newEp.name}" connected successfully.`);
  };

  const handleInviteOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newOp: OperatorUser = {
      id: `OP-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      clearance: inviteClearance,
      status: 'ACTIVE',
    };
    setOperators([...operators, newOp]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
    showToast(`Operator clearance invite generated for ${newOp.email}.`);
  };

  const toggleEndpoint = (id: string) => {
    setEndpoints(endpoints.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));
    showToast('Endpoint routing status updated.');
  };

  const toggleOperatorStatus = (id: string) => {
    setOperators(operators.map(o => o.id === id ? { ...o, status: o.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE' } : o));
    showToast('Operator clearance status updated.');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl w-full">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1a] border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            CONSOLE SYSTEM CONFIGURATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-sans">
            Operator Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#a8a89f] mt-1 max-w-2xl">
            Configure global telemetry pipelines, webhooks, RBAC clearance tiers, and zero-knowledge memory retention.
          </p>
        </div>

        <button
          onClick={() => showToast('All configuration parameters synced to backend store.')}
          className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Grid: Sub-navigation (Left) + Settings Panels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sub-nav */}
        <div className="lg:col-span-3 space-y-1.5 font-sans">
          <button
            onClick={() => setActiveSettingsTab('API')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-colors cursor-pointer ${
              activeSettingsTab === 'API'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
            }`}
          >
            <span>API Integrations</span>
            <span className="text-[10px] font-mono">›</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('NOTIF')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-colors cursor-pointer ${
              activeSettingsTab === 'NOTIF'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
            }`}
          >
            <span>Notification Protocols</span>
            <span className="text-[10px] font-mono">›</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('ACCESS')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-colors cursor-pointer ${
              activeSettingsTab === 'ACCESS'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
            }`}
          >
            <span>User Access Control (RBAC)</span>
            <span className="text-[10px] font-mono">›</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('HARDENING')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-colors cursor-pointer ${
              activeSettingsTab === 'HARDENING'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-[#8e928e] hover:text-white hover:bg-[#1c1c1a]'
            }`}
          >
            <span>System Hardening</span>
            <span className="text-[10px] font-mono">›</span>
          </button>
        </div>

        {/* Right Content Panels */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: API INTEGRATIONS                                                   */}
          {/* ========================================================================= */}
          {activeSettingsTab === 'API' && (
            <div className="space-y-6">
              <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">API & Webhook Integrations</h2>
                    <p className="text-xs text-[#8e928e] mt-0.5">Manage external telemetry pipelines and breach dispatch hooks.</p>
                  </div>
                  <button
                    onClick={() => setIsNewEndpointOpen(true)}
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Endpoint</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {endpoints.map((ep) => (
                    <div key={ep.id} className="p-4 rounded-xl bg-[#141413] border border-white/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#20201e] border border-white/10 flex items-center justify-center text-white">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{ep.name}</div>
                          <div className="text-[10px] text-[#8e928e] font-mono mt-0.5 uppercase truncate max-w-xs">{ep.url}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                          ep.isActive
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                            : 'bg-[#20201e] border-white/10 text-[#8e928e]'
                        }`}>
                          {ep.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <button
                          onClick={() => toggleEndpoint(ep.id)}
                          className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                            ep.isActive ? 'bg-white' : 'bg-[#282826]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full transition-transform ${
                            ep.isActive ? 'bg-black translate-x-5' : 'bg-[#8e928e] translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: NOTIFICATION PROTOCOLS                                             */}
          {/* ========================================================================= */}
          {activeSettingsTab === 'NOTIF' && (
            <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white" />
                  <span>Notification & Alert Protocols</span>
                </h2>
                <p className="text-xs text-[#8e928e] mt-0.5">Configure automated alerting channels for instant containment and canary tripwire hits.</p>
              </div>

              <div className="space-y-4">
                {/* Telegram Bot */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white">Telegram SOC Security Bot</div>
                    <div className="text-[10px] text-[#8e928e] font-mono mt-0.5">@AnveshakAlertBot • Instant 0-day triage notifications</div>
                  </div>
                  <button
                    onClick={() => { setTelegramActive(!telegramActive); showToast('Telegram dispatch status updated.'); }}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${telegramActive ? 'bg-white' : 'bg-[#282826]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${telegramActive ? 'bg-black translate-x-5' : 'bg-[#8e928e] translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Discord Webhook */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white">Discord Webhook Channel</div>
                    <div className="text-[10px] text-[#8e928e] font-mono mt-0.5">#security-incident-stream • Real-time telemetry feed</div>
                  </div>
                  <button
                    onClick={() => { setDiscordActive(!discordActive); showToast('Discord dispatch status updated.'); }}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${discordActive ? 'bg-white' : 'bg-[#282826]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${discordActive ? 'bg-black translate-x-5' : 'bg-[#8e928e] translate-x-0'}`}></div>
                  </button>
                </div>

                {/* PagerDuty High Severity */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white">PagerDuty On-Call Escalate</div>
                    <div className="text-[10px] text-[#8e928e] font-mono mt-0.5">Trigger on-call escalation only for CRITICAL SEV Canary Leaks</div>
                  </div>
                  <button
                    onClick={() => { setPagerDutyActive(!pagerDutyActive); showToast('PagerDuty escalation status updated.'); }}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${pagerDutyActive ? 'bg-white' : 'bg-[#282826]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${pagerDutyActive ? 'bg-black translate-x-5' : 'bg-[#8e928e] translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Email Digest Selector */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-white">Email Digest Frequency</div>
                  <div className="flex items-center bg-[#20201e] border border-white/10 rounded-xl p-1 font-mono text-xs max-w-md">
                    {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => { setEmailDigest(freq); showToast(`Email frequency set to ${freq}.`); }}
                        className={`flex-1 py-1.5 text-center rounded-lg uppercase transition-colors cursor-pointer ${
                          emailDigest === freq ? 'bg-white text-black font-bold' : 'text-[#8e928e] hover:text-white'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: USER ACCESS CONTROL                                                */}
          {/* ========================================================================= */}
          {activeSettingsTab === 'ACCESS' && (
            <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>User Access Control (RBAC)</span>
                  </h2>
                  <p className="text-xs text-[#8e928e] mt-0.5">Manage operator permissions, clearance levels, and cryptographic authentication.</p>
                </div>
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite Operator</span>
                </button>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-semibold text-[#8e928e] uppercase tracking-widest font-mono">
                      <th className="pb-3 px-2">OPERATOR</th>
                      <th className="pb-3 px-3">ROLE</th>
                      <th className="pb-3 px-3">CLEARANCE</th>
                      <th className="pb-3 px-3">STATUS</th>
                      <th className="pb-3 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {operators.map((op) => (
                      <tr key={op.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-2">
                          <div className="text-white font-sans font-bold">{op.name}</div>
                          <div className="text-[10px] text-[#8e928e]">{op.email}</div>
                        </td>
                        <td className="py-3.5 px-3 text-white font-sans">{op.role}</td>
                        <td className="py-3.5 px-3 text-white font-bold">{op.clearance}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            op.status === 'ACTIVE'
                              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-950/40 border border-rose-500/30 text-rose-400'
                          }`}>
                            {op.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => toggleOperatorStatus(op.id)}
                            className="text-xs text-[#8e928e] hover:text-white font-sans font-medium transition-colors cursor-pointer"
                          >
                            {op.status === 'ACTIVE' ? 'Revoke Key' : 'Restore'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SYSTEM HARDENING                                                   */}
          {/* ========================================================================= */}
          {activeSettingsTab === 'HARDENING' && (
            <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Lock className="w-5 h-5 text-white" />
                  <span>System Hardening & Zero-Trust Architecture</span>
                </h2>
                <p className="text-xs text-[#8e928e] mt-0.5">Advanced zero-trust protocols for the internal operating environment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Retention */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-white">Data Retention Period</div>
                    <div className="text-[11px] text-[#8e928e] mt-0.5">Duration to keep raw OSINT logs before purging.</div>
                  </div>
                  <div className="flex items-center bg-[#20201e] border border-white/10 rounded-xl p-1 font-mono text-xs">
                    {(['7', '30', '90'] as const).map((days) => (
                      <button
                        key={days}
                        onClick={() => { setRetentionPeriod(days); showToast(`Retention period set to ${days} days.`); }}
                        className={`flex-1 py-2 text-center rounded-lg transition-colors cursor-pointer ${
                          retentionPeriod === days ? 'bg-white text-black font-bold' : 'text-[#8e928e] hover:text-white'
                        }`}
                      >
                        {days} DAYS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strict MFA */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-white">Strict MFA Enforcement</div>
                    <div className="text-[11px] text-[#8e928e] mt-0.5">Require FIDO2 / YubiKey for administrative probes.</div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => { setMfaEnabled(!mfaEnabled); showToast('MFA policy updated.'); }}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                        mfaEnabled ? 'bg-white' : 'bg-[#282826]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full transition-transform ${
                        mfaEnabled ? 'bg-black translate-x-6' : 'bg-[#8e928e] translate-x-0'
                      }`}></div>
                    </button>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {mfaEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>

                {/* Zero-Knowledge Memory Wipe */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-white">Zero-Knowledge Memory Wipe</div>
                    <div className="text-[11px] text-[#8e928e] mt-0.5">Purge in-memory K-Anonymity candidate buckets on logout.</div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => { setZeroKnowledgeWipe(!zeroKnowledgeWipe); showToast('Zero-knowledge wipe policy updated.'); }}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                        zeroKnowledgeWipe ? 'bg-white' : 'bg-[#282826]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full transition-transform ${
                        zeroKnowledgeWipe ? 'bg-black translate-x-6' : 'bg-[#8e928e] translate-x-0'
                      }`}></div>
                    </button>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {zeroKnowledgeWipe ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Autonomous Threat IP Ban */}
                <div className="p-4 rounded-xl bg-[#141413] border border-white/5 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-white">Autonomous Threat IP Ban</div>
                    <div className="text-[11px] text-[#8e928e] mt-0.5">Automatically sever network traversal on canary tripwire hits.</div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => { setIpRateLimit(!ipRateLimit); showToast('Autonomous containment rule updated.'); }}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                        ipRateLimit ? 'bg-white' : 'bg-[#282826]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full transition-transform ${
                        ipRateLimit ? 'bg-black translate-x-6' : 'bg-[#8e928e] translate-x-0'
                      }`}></div>
                    </button>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {ipRateLimit ? 'AUTO-CONTAIN' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: NEW ENDPOINT MODAL */}
      {isNewEndpointOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl text-[#e5e2e0]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white">Add New Integration Webhook</h3>
              <button onClick={() => setIsNewEndpointOpen(false)} className="p-1 rounded hover:bg-white/10 text-[#8e928e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEndpoint} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8e928e] mb-1 font-medium">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Datadog Security Webhook"
                  value={newEndpointName}
                  onChange={(e) => setNewEndpointName(e.target.value)}
                  className="w-full bg-[#141413] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[#8e928e] mb-1 font-medium">Endpoint URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://api.service.io/webhook"
                  value={newEndpointUrl}
                  onChange={(e) => setNewEndpointUrl(e.target.value)}
                  className="w-full bg-[#141413] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Connect Endpoint
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE OPERATOR MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl text-[#e5e2e0]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white">Issue Operator Clearance Invite</h3>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded hover:bg-white/10 text-[#8e928e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteOperator} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8e928e] mb-1 font-medium">Operator Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-[#141413] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[#8e928e] mb-1 font-medium">Clearance Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex.m@defense.corp"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#141413] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e928e] mb-1 font-medium">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-[#141413] border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Operator">Operator</option>
                    <option value="Auditor (Read-Only)">Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e928e] mb-1 font-medium">Clearance Tier</label>
                  <select
                    value={inviteClearance}
                    onChange={(e) => setInviteClearance(e.target.value)}
                    className="w-full bg-[#141413] border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
                  >
                    <option value="Level 4">Level 4 (Super)</option>
                    <option value="Level 3">Level 3 (Lead)</option>
                    <option value="Level 2">Level 2 (Standard)</option>
                    <option value="Level 1">Level 1 (Auditor)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Generate Clearance Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
