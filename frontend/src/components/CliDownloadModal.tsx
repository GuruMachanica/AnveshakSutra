import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, X, Laptop, FileCode } from 'lucide-react';

interface CliDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CliDownloadModal: React.FC<CliDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeOs, setActiveOs] = useState<'LINUX' | 'WINDOWS' | 'MACOS'>('LINUX');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getCurlCmd = () => {
    return 'curl -sSL https://anveshaksutra.onrender.com/downloads/install.sh | bash';
  };

  const getPowerShellCmd = () => {
    return 'irm https://anveshaksutra.onrender.com/downloads/install.ps1 | iex';
  };

  const getPipCmd = () => {
    return 'pip install https://anveshaksutra.onrender.com/downloads/anveshak_cli-1.0.0-py3-none-any.whl';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1c1a] border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-[#e5e2e0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8e928e] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>OFFICIAL DEVELOPER CLI DISTRIBUTION (v1.0.0)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            Install AnveshakSutra CLI
          </h2>
          <p className="text-xs sm:text-sm text-[#8e928e] leading-relaxed">
            Run local code repository scans, real-time file watcher daemons, Shannon entropy detection, and autonomous self-healing secret scrubbers directly from your terminal.
          </p>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'LINUX', label: 'Linux (Ubuntu/Debian)', icon: <Laptop className="w-4 h-4" /> },
            { id: 'MACOS', label: 'macOS (Darwin / M-Series)', icon: <Laptop className="w-4 h-4" /> },
            { id: 'WINDOWS', label: 'Windows (PowerShell)', icon: <Terminal className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOs(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                activeOs === tab.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-[#131312] text-[#8e928e] hover:text-white border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1-Line Quick Install Script */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#8e928e] uppercase font-bold flex items-center justify-between">
            <span>1-Line Automated Terminal Installer</span>
            <span className="text-emerald-400 text-[10px]">RECOMMENDED</span>
          </div>

          <div className="bg-[#131312] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 font-mono text-xs text-emerald-400">
            <span className="truncate select-all">
              {activeOs === 'WINDOWS' ? getPowerShellCmd() : getCurlCmd()}
            </span>
            <button
              onClick={() => copyToClipboard('1line', activeOs === 'WINDOWS' ? getPowerShellCmd() : getCurlCmd())}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              {copiedCmd === '1line' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === '1line' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Direct Pip Install Wheel */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#8e928e] uppercase font-bold">
            Python Pip Direct Wheel Installation
          </div>

          <div className="bg-[#131312] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 font-mono text-xs text-white">
            <span className="truncate select-all text-neutral-300">{getPipCmd()}</span>
            <button
              onClick={() => copyToClipboard('pip', getPipCmd())}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              {copiedCmd === 'pip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === 'pip' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Direct Package Downloads */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="text-xs font-mono text-[#8e928e] uppercase font-bold">
            Direct Offline Package Downloads (.whl / .tar.gz)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/downloads/anveshak_cli-1.0.0-py3-none-any.whl"
              download
              className="flex items-center justify-between p-3.5 bg-[#131312] border border-white/10 hover:border-white/30 rounded-xl text-xs font-mono text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>anveshak_cli-1.0.0.whl</span>
              </div>
              <Download className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
            </a>

            <a
              href="/downloads/anveshak_cli-1.0.0.tar.gz"
              download
              className="flex items-center justify-between p-3.5 bg-[#131312] border border-white/10 hover:border-white/30 rounded-xl text-xs font-mono text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>anveshak_cli-1.0.0.tar.gz</span>
              </div>
              <Download className="w-4 h-4 text-[#8e928e] group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
