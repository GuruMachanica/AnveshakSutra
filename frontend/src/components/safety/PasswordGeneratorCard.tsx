import React, { useState } from 'react';
import { Key, RefreshCw, Check, Copy } from 'lucide-react';

export const PasswordGeneratorCard: React.FC = () => {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  const generateSafePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    setCopiedPass(false);
  };

  const copyPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="bg-[#1c1c1a] border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-xl flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
          <Key className="w-4 h-4" />
          <span>Easy Security Tool</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Instant Strong Password Generator</h3>
        <p className="text-xs sm:text-sm text-[#a8a89f] leading-relaxed">
          Hackers guess millions of passwords a second. Generate a random, uncrackable password for your accounts in 1 click.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 bg-[#131312] border border-white/10 rounded-2xl p-3 sm:p-4">
          <span className="font-mono text-xs sm:text-base text-emerald-400 font-bold select-all truncate">
            {generatedPassword || 'Click "Create Password" below'}
          </span>
          {generatedPassword && (
            <button
              onClick={copyPassword}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPass ? 'COPIED' : 'COPY'}</span>
            </button>
          )}
        </div>

        <button
          onClick={generateSafePassword}
          className="w-full py-3 sm:py-3.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Create Strong Password</span>
        </button>
      </div>
    </div>
  );
};
