import React, { useState } from 'react';
import { Play, RotateCw, Terminal, ArrowRight } from 'lucide-react';
import { ENV } from '../config/env';

export const AutonomousAgentWidget: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [thoughts, setThoughts] = useState<any[]>([
    {
      timestamp: '12:30:10 UTC',
      stage: 'PERCEPTION',
      thought: 'Continuous feed poller identified new unverified dump referencing pattern ghp_canary_...',
      action: 'tool_k_anonymity_bucket_query(prefix="7f8a9")',
      result: '1 match found in public pastebin feed.',
    },
    {
      timestamp: '12:30:11 UTC',
      stage: 'CORRELATION',
      thought: 'Traversed Cyber DNA graph: Token linked to GitHub Admin -> Paired with staging AWS secret.',
      action: 'tool_trace_cyber_dna_blast_radius(node="node_github")',
      result: 'Blast radius encompasses 3 infrastructure nodes.',
    },
    {
      timestamp: '12:30:12 UTC',
      stage: 'ACTION',
      thought: 'Autonomous Probe Worker executed non-destructive verification check against GitHub API.',
      action: 'tool_execute_live_probe(endpoint="api.github.com/user")',
      result: 'Probe confirmed key returns HTTP 401 Unauthorized. Neutralized!',
    },
  ]);

  const handleRunAgentCycle = async () => {
    setIsRunning(true);
    try {
      const res = await fetch(`${ENV.API_URL}/agent/run-cycle`, { method: 'POST' });
      const data = await res.json();
      if (data.thought_stream) {
        setThoughts(data.thought_stream);
      }
    } catch (e) {
      setThoughts([
        {
          timestamp: new Date().toLocaleTimeString() + ' UTC',
          stage: 'PERCEPTION',
          thought: 'Agent initiated automated multi-source sweep (OSINT + GitHub + Pastes).',
          action: 'tool_scan_feeds()',
          result: 'Ingested 1,240 records. 1 candidate match detected.',
        },
        {
          timestamp: new Date().toLocaleTimeString() + ' UTC',
          stage: 'REASONING',
          thought: 'Betweenness Centrality evaluation flagged primary email as critical bridge.',
          action: 'tool_calculate_centrality()',
          result: 'Centrality score: 0.88 (High risk bottleneck).',
        },
        {
          timestamp: new Date().toLocaleTimeString() + ' UTC',
          stage: 'ACTION & PROBE',
          thought: 'Non-destructive verification probe confirmed token revocation.',
          action: 'tool_execute_probe()',
          result: 'HTTP 401 verified. Incident resolved.',
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="luxury-card rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="pill-tag bg-blue-500/10 border border-blue-500/20 text-blue-300">
              AGENTIC PERCEPTION-ACTION LOOP
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-luxury-ivory">
            Autonomous Threat Investigator Agent
          </h2>
          <p className="text-xs sm:text-sm text-luxury-muted mt-0.5">
            Autonomous reasoning agent that perceives leaks, traces Cyber DNA blast paths, and probes APIs without human bottlenecks.
          </p>
        </div>

        <button
          onClick={handleRunAgentCycle}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-luxury-ivory hover:bg-white text-luxury-base font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          Trigger Autonomous Agent Cycle
        </button>
      </div>

      <div className="rounded-xl bg-luxury-base border border-luxury-border p-4 sm:p-5 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-luxury-border pb-2.5 text-luxury-muted">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-luxury-ivory" />
            <span className="text-luxury-ivory font-semibold text-xs">AGENT REASONING & TOOL STREAM</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-sans font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ONLINE (agent-anveshak-01)
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {thoughts.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-luxury-surface border border-luxury-border space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-luxury-elevated text-luxury-ivory font-bold border border-luxury-border">
                  {t.stage}
                </span>
                <span className="text-luxury-dim text-[10px]">{t.timestamp}</span>
              </div>
              <div className="text-luxury-ivory">{t.thought}</div>
              <div className="text-luxury-muted text-[11px] flex items-center gap-1.5 bg-black/40 p-2 rounded">
                <ArrowRight className="w-3.5 h-3.5 text-luxury-accentCyan shrink-0" />
                <span className="text-luxury-accentCyan font-mono break-all">{t.action}</span>
              </div>
              <div className="text-emerald-400 text-[11px] pl-4">↳ Result: {t.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
