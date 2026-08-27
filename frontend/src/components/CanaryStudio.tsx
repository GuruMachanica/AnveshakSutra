import React, { useState, useEffect } from 'react';
import { Copy, Check, PlusCircle, Trash2, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient, CanaryItem } from '../services/apiClient';

export const CanaryStudio: React.FC = () => {
  const [canaries, setCanaries] = useState<CanaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState('GITHUB_PAT');
  const [labelInput, setLabelInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCanaries = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getCanaries();
      setCanaries(data);
    } catch {
      console.log('Using local fallback for canaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanaries();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newCanary = await apiClient.createCanary({
        label: labelInput.trim(),
        type: selectedType,
      });
      setCanaries((prev) => [newCanary, ...prev]);
      setLabelInput('');
      showToast(`Generated & armed new honey-credential: "${newCanary.name}"`);
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Failed to create canary'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDetonate = async (canary: CanaryItem) => {
    try {
      if (canary.status === 'ARMED') {
        await apiClient.detonateCanary(canary.id);
        setCanaries((prev) =>
          prev.map((c) => (c.id === canary.id ? { ...c, status: 'TRIGGERED', detonatedAt: 'Just now' } : c))
        );
        showToast(`🚨 TRIPWIRE DETONATED: "${canary.name}" - Incident logged to Threat Intel Feed!`);
      } else {
        setCanaries((prev) =>
          prev.map((c) => (c.id === canary.id ? { ...c, status: 'ARMED', detonatedAt: undefined } : c))
        );
        showToast(`Tripwire "${canary.name}" re-armed.`);
      }
    } catch {
      showToast(`Detonation state updated locally for "${canary.name}".`);
    }
  };

  const handleDeleteCanary = async (id: string) => {
    try {
      await apiClient.deleteCanary(id);
      setCanaries((prev) => prev.filter((c) => c.id !== id));
      showToast('Canary tripwire revoked and removed from monitoring.');
    } catch {
      setCanaries((prev) => prev.filter((c) => c.id !== id));
      showToast('Canary removed locally.');
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#1c1c1a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1a] border border-emerald-500/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            ACTIVE DECEPTION &amp; HONEY-CREDENTIAL STUDIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-sans">
            Canary Credentials &amp; Decoy Tripwires
          </h1>
          <p className="text-xs sm:text-sm text-[#8e928e] max-w-2xl mt-1">
            Synthesizes context-aware decoy credentials for AWS, GitHub, and OpenAI. If scraped or executed by a threat actor, an instantaneous 0-day alert is triggered.
          </p>
        </div>
        <button
          onClick={fetchCanaries}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-neutral-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Canaries</span>
        </button>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="bg-[#131312] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#8e928e] uppercase mb-1.5">Credential Decoy Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#1c1c1a] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/30"
            >
              <option value="GITHUB_PAT">GitHub Personal Access Token (PAT)</option>
              <option value="AWS_KEY">AWS IAM Access Key &amp; Secret</option>
              <option value="OPENAI_KEY">OpenAI API Key (sk-proj-...)</option>
              <option value="STRIPE_KEY">Stripe Live Secret Key (sk_live_...)</option>
              <option value="DATABASE_URL">PostgreSQL Database Connection URI</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-[#8e928e] uppercase mb-1.5">Tripwire Name / Placement Memo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g., Planted in staging .env.local or Notion runbook..."
                className="flex-1 bg-[#1c1c1a] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-[#8e928e]/50 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                disabled={isSubmitting || !labelInput.trim()}
                className="flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-semibold font-mono tracking-wider transition-colors cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'GENERATING...' : 'GENERATE'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Active Tripwires List */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#8e928e] font-bold">
          Active Armed Decoys ({canaries.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#8e928e] animate-pulse">
            Connecting to Deception Network...
          </div>
        ) : canaries.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#8e928e] bg-[#131312] border border-white/5 rounded-xl">
            No Canary tripwires armed yet. Generate one above to begin dark-web deception monitoring.
          </div>
        ) : (
          canaries.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-all ${
                c.status === 'TRIGGERED'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-[#131312] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        c.status === 'TRIGGERED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {c.status === 'TRIGGERED' ? '🚨 DETONATED (LEAK DETECTED)' : '🟢 ARMED &amp; MONITORING'}
                    </span>
                    <span className="text-xs font-semibold text-white font-sans">{c.name}</span>
                    <span className="text-[10px] font-mono text-[#8e928e]">({c.type})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-emerald-400 border border-white/5 select-all">
                      {c.tokenValue}
                    </code>
                    <button
                      onClick={() => copyToClipboard(c.id, c.tokenValue)}
                      className="p-1 text-[#8e928e] hover:text-white transition-colors"
                      title="Copy Token to Clipboard"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-[#8e928e]">
                    Memo: {c.memo} • Created: {c.createdAt} {c.detonatedAt ? `• Detonated: ${c.detonatedAt}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleDetonate(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      c.status === 'TRIGGERED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    {c.status === 'TRIGGERED' ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>RE-ARM</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>TEST TRIPWIRE</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteCanary(c.id)}
                    className="p-2 text-[#8e928e] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Revoke &amp; Delete Canary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
