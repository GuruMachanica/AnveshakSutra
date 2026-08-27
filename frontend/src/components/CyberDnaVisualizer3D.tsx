import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Cpu, Activity } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: string;
  status: 'CLEAN' | 'EXPOSED' | 'VULNERABLE' | 'TRIGGERED';
  centrality: number;
  relX: number;
  relY: number;
}

interface Edge {
  source: string;
  target: string;
  relationship: string;
}

interface CyberDnaProps {
  isAttackActive?: boolean;
}

export const CyberDnaVisualizer3D: React.FC<CyberDnaProps> = ({ isAttackActive = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode] = useState<Node | null>(null);

  const [nodes] = useState<Node[]>([
    { id: 'node_email', label: 'huzaifa@ironlogic.in', type: 'EMAIL', status: 'CLEAN', centrality: 0.88, relX: 0.48, relY: 0.28 },
    { id: 'node_github', label: 'github.com/GuruMachanica', type: 'GITHUB', status: isAttackActive ? 'EXPOSED' : 'CLEAN', centrality: 0.76, relX: 0.25, relY: 0.52 },
    { id: 'node_repo', label: 'Repo: AnveshakSutra', type: 'REPO', status: 'CLEAN', centrality: 0.45, relX: 0.72, relY: 0.48 },
    { id: 'node_aws', label: 'AWS Prod Key (AKIA...)', type: 'TOKEN', status: isAttackActive ? 'VULNERABLE' : 'CLEAN', centrality: 0.65, relX: 0.58, relY: 0.78 },
    { id: 'node_canary', label: '🪤 Canary Honey Token', type: 'CANARY', status: isAttackActive ? 'TRIGGERED' : 'CLEAN', centrality: 0.40, relX: 0.20, relY: 0.82 },
    { id: 'node_domain', label: 'ironlogic.in (DNS)', type: 'DOMAIN', status: 'CLEAN', centrality: 0.58, relX: 0.78, relY: 0.22 },
  ]);

  const edges: Edge[] = [
    { source: 'node_email', target: 'node_github', relationship: 'AUTHENTICATES_TO' },
    { source: 'node_github', target: 'node_repo', relationship: 'MAINTAINS' },
    { source: 'node_repo', target: 'node_aws', relationship: 'REFERENCES_SECRET' },
    { source: 'node_github', target: 'node_canary', relationship: 'MONITORED_BY' },
    { source: 'node_email', target: 'node_domain', relationship: 'ADMIN_FOR' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseTime = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = Math.max(340, Math.min(rect.width * 0.65, 520));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.035;

      ctx.strokeStyle = 'rgba(244, 244, 241, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = Math.max(30, width / 18);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const mappedNodes = nodes.map((n) => ({
        ...n,
        x: n.relX * width,
        y: n.relY * height,
      }));

      edges.forEach((edge) => {
        const src = mappedNodes.find((n) => n.id === edge.source);
        const tgt = mappedNodes.find((n) => n.id === edge.target);
        if (!src || !tgt) return;

        const isCompromisedEdge = isAttackActive && (src.status !== 'CLEAN' || tgt.status !== 'CLEAN');

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = isCompromisedEdge
          ? `rgba(251, 113, 133, ${0.45 + Math.sin(pulseTime * 3) * 0.35})`
          : 'rgba(244, 244, 241, 0.12)';
        ctx.lineWidth = isCompromisedEdge ? 2.5 : 1.2;
        ctx.setLineDash(isCompromisedEdge ? [6, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        const t = (Math.sin(pulseTime + src.x * 0.02) + 1) / 2;
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, isCompromisedEdge ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isCompromisedEdge ? '#fb7185' : '#f4f4f1';
        ctx.fill();
      });

      mappedNodes.forEach((node) => {
        const isHovered = selectedNode?.id === node.id;
        let nodeStroke = '#f4f4f1';
        let nodeFill = '#1c1c1a';

        if (node.status === 'EXPOSED' || node.status === 'TRIGGERED') {
          nodeStroke = '#fb7185';
          nodeFill = 'rgba(251, 113, 133, 0.15)';
        } else if (node.status === 'VULNERABLE') {
          nodeStroke = '#fbbf24';
          nodeFill = 'rgba(251, 191, 36, 0.15)';
        }

        const radius = Math.max(7, Math.min(width * 0.015, 12)) + node.centrality * 4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * (isHovered ? 1.4 : 1.15), 0, Math.PI * 2);
        ctx.fillStyle = node.status !== 'CLEAN' ? 'rgba(251, 113, 133, 0.12)' : 'rgba(244, 244, 241, 0.03)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeFill;
        ctx.strokeStyle = nodeStroke;
        ctx.lineWidth = 1.8;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isHovered ? '#ffffff' : '#a8a89f';
        const fontSize = Math.max(9, Math.min(width * 0.018, 12));
        ctx.font = `500 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [nodes, edges, isAttackActive, selectedNode]);

  return (
    <div className="luxury-card rounded-2xl p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="pill-tag bg-white/5 border border-white/10 text-luxury-ivory">
              TOPOLOGICAL INTELLIGENCE
            </span>
            {isAttackActive && (
              <span className="pill-tag bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-pulse">
                BLAST RADIUS ACTIVE
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-luxury-ivory">
            3D Cyber DNA™ Blast Radius Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-luxury-muted mt-0.5">
            Dynamic relational topology mapping single points of failure across your digital attack surface.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-luxury-elevated border border-luxury-border flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-luxury-muted text-[10px] uppercase tracking-wider">Critical Bottleneck</div>
            <div className="font-semibold text-luxury-ivory font-mono text-[11px] sm:text-xs">
              huzaifa@ironlogic.in (Score: <strong>0.88</strong>)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          ref={containerRef}
          className="lg:col-span-8 w-full bg-luxury-base rounded-xl border border-luxury-border p-2 overflow-hidden relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]"
        >
          <canvas ref={canvasRef} className="w-full h-auto cursor-pointer block" />
          <div className="absolute bottom-3 left-4 text-[10px] text-luxury-dim font-mono tracking-wider">
            RESPONSIVE HIGH-DPI CANVAS (TOUCH & POINTER ENABLED)
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-luxury-elevated border border-luxury-border space-y-3">
            <h3 className="text-xs font-semibold text-luxury-ivory tracking-wide uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-luxury-accentCyan" />
              Graph Centrality Metrics
            </h3>
            <p className="text-xs text-luxury-muted leading-relaxed">
              Betweenness Centrality algorithms calculate which nodes act as critical bridges for lateral privilege escalation.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-luxury-muted">Primary Email Bridge</span>
                  <span className="text-luxury-ivory font-bold">0.88</span>
                </div>
                <div className="w-full bg-luxury-base rounded-full h-1.5 overflow-hidden">
                  <div className="bg-luxury-ivory h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-luxury-muted">GitHub Admin Account</span>
                  <span className="text-amber-400 font-bold">0.76</span>
                </div>
                <div className="w-full bg-luxury-base rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-luxury-elevated border border-luxury-border space-y-2.5 text-xs">
            <h3 className="font-semibold text-luxury-ivory tracking-wide uppercase flex items-center gap-2 text-xs">
              <Activity className="w-4 h-4 text-rose-400" />
              Predicted Exploit Chain
            </h3>
            <div className="space-y-2 text-luxury-muted text-[11px] sm:text-xs">
              <div className="flex items-start gap-2 text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0"></span>
                <span>1. Canary Honey-Token Leaked in Public Paste</span>
              </div>
              <div className="flex items-start gap-2 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></span>
                <span>2. Credential Stuffing on Admin GitHub</span>
              </div>
              <div className="flex items-start gap-2 text-luxury-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-dim mt-1 shrink-0"></span>
                <span>3. Lateral Staging Secret Exfiltration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
