import React, { useState } from 'react';
import { Heart, Plus, Phone, Instagram, Mail, Trash2 } from 'lucide-react';

export interface WatchlistItem {
  id: string;
  name: string;
  target: string;
  type: 'EMAIL' | 'PHONE' | 'INSTAGRAM';
  status: 'SAFE' | 'AT_RISK';
}

export const FamilyWatchlistCard: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { id: '1', name: 'My Personal Gmail', target: 'alex.smith@gmail.com', type: 'EMAIL', status: 'SAFE' },
    { id: '2', name: 'Family WhatsApp Phone', target: '+1 (555) 234-5678', type: 'PHONE', status: 'SAFE' },
    { id: '3', name: 'Instagram Creator Account', target: '@alex_designs', type: 'INSTAGRAM', status: 'SAFE' },
  ]);
  const [newWatchName, setNewWatchName] = useState('');
  const [newWatchTarget, setNewWatchTarget] = useState('');
  const [newWatchType, setNewWatchType] = useState<'EMAIL' | 'PHONE' | 'INSTAGRAM'>('EMAIL');
  const [showAddWatchlist, setShowAddWatchlist] = useState(false);

  const handleAddWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchName.trim() || !newWatchTarget.trim()) return;

    setWatchlist([
      ...watchlist,
      {
        id: Date.now().toString(),
        name: newWatchName.trim(),
        target: newWatchTarget.trim(),
        type: newWatchType,
        status: 'SAFE',
      },
    ]);
    setNewWatchName('');
    setNewWatchTarget('');
    setShowAddWatchlist(false);
  };

  return (
    <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-xl flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
            <Heart className="w-4 h-4" />
            <span>Family Safety Guard</span>
          </div>
          <button
            onClick={() => setShowAddWatchlist(true)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Family &amp; Accounts Watchlist</h3>
        <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
          Keep your parents, children, and personal accounts safe by monitoring multiple targets under one simple dashboard.
        </p>
      </div>

      <div className="space-y-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
        {watchlist.map((item) => (
          <div key={item.id} className="p-3 bg-[#131312] border border-white/5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
                {item.type === 'PHONE' ? <Phone className="w-3.5 h-3.5" /> : item.type === 'INSTAGRAM' ? <Instagram className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                <p className="text-[10px] sm:text-[11px] font-mono text-[#8e928e] truncate">{item.target}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SAFE
              </span>
              <button
                onClick={() => setWatchlist(watchlist.filter((w) => w.id !== item.id))}
                className="p-1 text-[#8e928e] hover:text-rose-400 transition-colors cursor-pointer"
                title="Remove from watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Watchlist Modal */}
      {showAddWatchlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/20 rounded-3xl max-w-md w-full p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl relative">
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Add Account to Monitor</h3>
            <p className="text-xs text-[#8e928e]">Monitored with zero-knowledge cryptographic privacy.</p>

            <form onSubmit={handleAddWatchlist} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-[#8e928e] uppercase mb-1">Friendly Name</label>
                <input
                  type="text"
                  required
                  value={newWatchName}
                  onChange={(e) => setNewWatchName(e.target.value)}
                  placeholder="e.g. Dad's Work Email"
                  className="w-full bg-[#131312] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8e928e] uppercase mb-1">Account Type</label>
                <select
                  value={newWatchType}
                  onChange={(e) => setNewWatchType(e.target.value as any)}
                  className="w-full bg-[#131312] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  <option value="EMAIL">Email Address</option>
                  <option value="PHONE">Phone Number (WhatsApp / SMS)</option>
                  <option value="INSTAGRAM">Instagram Handle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8e928e] uppercase mb-1">Identifier</label>
                <input
                  type="text"
                  required
                  value={newWatchTarget}
                  onChange={(e) => setNewWatchTarget(e.target.value)}
                  placeholder="e.g. dad@email.com or +1 555 987 6543"
                  className="w-full bg-[#131312] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWatchlist(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
