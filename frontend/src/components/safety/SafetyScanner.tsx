import React from 'react';
import { Mail, Phone, Instagram, Key, RefreshCw, Search } from 'lucide-react';

export type SafetyInputType = 'EMAIL' | 'PHONE' | 'INSTAGRAM' | 'PASSWORD';

interface SafetyScannerProps {
  activeType: SafetyInputType;
  onTypeChange: (type: SafetyInputType) => void;
  queryInput: string;
  onQueryChange: (val: string) => void;
  isScanning: boolean;
  deepScan: boolean;
  onDeepScanChange: (val: boolean) => void;
  onScanSubmit: (e?: React.FormEvent) => void;
}

export const SafetyScanner: React.FC<SafetyScannerProps> = ({
  activeType,
  onTypeChange,
  queryInput,
  onQueryChange,
  isScanning,
  deepScan,
  onDeepScanChange,
  onScanSubmit,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Category Pills (Mobile 2x2 or Desktop Row) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[
          { id: 'EMAIL', label: 'Email / Gmail', icon: <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: 'PHONE', label: 'Phone (WhatsApp)', icon: <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: 'INSTAGRAM', label: 'Instagram Handle', icon: <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { id: 'PASSWORD', label: 'Check Password', icon: <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => onTypeChange(cat.id as any)}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeType === cat.id
                ? 'bg-white text-black font-bold border-white shadow-lg'
                : 'bg-[#131312] text-[#8e928e] border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            {cat.icon}
            <span className="truncate">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Big Search Input Form */}
      <form onSubmit={onScanSubmit} className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5 bg-[#131312] border-2 border-white/20 hover:border-white/40 focus-within:border-emerald-400 p-1.5 sm:p-2 rounded-2xl transition-all shadow-inner">
          <input
            type="text"
            required
            value={queryInput}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              activeType === 'EMAIL'
                ? 'Enter your email (e.g. alex.smith@gmail.com)...'
                : activeType === 'PHONE'
                ? 'Enter phone (e.g. +1 555 123 4567)...'
                : activeType === 'INSTAGRAM'
                ? 'Enter Instagram (e.g. @username)...'
                : 'Enter password to check...'
            }
            className="w-full bg-transparent px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-base text-white placeholder-[#8e928e] focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={isScanning || !queryInput.trim()}
            className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-bold px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>{isScanning ? 'Scanning...' : 'Deep Safety Check'}</span>
          </button>
        </div>

        {/* Deep Dark Web Checkbox */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#8e928e] bg-[#131312] p-2.5 sm:p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="deepScanToggle"
              checked={deepScan}
              onChange={(e) => onDeepScanChange(e.target.checked)}
              className="rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="deepScanToggle" className="cursor-pointer select-none text-white text-[11px] sm:text-xs font-medium">
              Deep Dark Web Scan (boAt 7.5M &amp; Google Dark Web Index)
            </label>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">● 100% PRIVATE RAM ENCRYPTION</span>
        </div>
      </form>
    </div>
  );
};
