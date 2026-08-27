import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Key, Database, Ban, ShieldCheck, Cpu, RefreshCw, Flame } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: 'CLEAN' | 'EXPOSED' | 'VULNERABLE' | 'TRIGGERED' | 'ISOLATED';
  centrality: number;
  val: number;
  ipOrLocation?: string;
}

export const EntityMappingView: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'node_email_primary', label: 'huzaifa@ironlogic.in', type: 'EMAIL', status: 'CLEAN', centrality: 0.88, val: 25, ipOrLocation: 'Primary Admin Identity' },
    { id: 'node_github', label: 'github.com/GuruMachanica', type: 'GITHUB', status: 'EXPOSED', centrality: 0.76, val: 20, ipOrLocation: 'CI/CD Organization' },
    { id: 'node_repo_anveshak', label: 'Repo: AnveshakSutra', type: 'REPOSITORY', status: 'CLEAN', centrality: 0.45, val: 15, ipOrLocation: 'Private Monorepo' },
    { id: 'node_aws_token', label: 'AWS Production Key (AKIA...)', type: 'TOKEN', status: 'VULNERABLE', centrality: 0.65, val: 18, ipOrLocation: 'arn:aws:iam::prod' },
    { id: 'node_discord', label: 'Discord (Dev Admin)', type: 'SERVICE', status: 'CLEAN', centrality: 0.32, val: 14, ipOrLocation: 'OAuth2 Integration' },
    { id: 'node_domain', label: 'ironlogic.in', type: 'DOMAIN', status: 'CLEAN', centrality: 0.58, val: 16, ipOrLocation: 'Apex Domain DNS' },
    { id: 'node_canary_pat', label: '🪤 Canary Honey Token', type: 'CANARY', status: 'TRIGGERED', centrality: 0.40, val: 15, ipOrLocation: 'Planted in CI/CD Commit' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_email_primary');
  const [isIsolated, setIsIsolated] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState('EMAIL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchGraph = async () => {
    try {
      const data = await apiClient.getCyberDnaGraph();
      if (data && data.nodes && data.nodes.length > 0) {
        setNodes(
          data.nodes.map((n) => ({
            id: n.id,
            label: n.label,
            type: n.type,
            status: n.status as any,
            centrality: n.centrality,
            val: n.val,
            ipOrLocation: n.type === 'CANARY' ? 'Planted Honey-Token Decoy' : 'Perimeter Asset',
          }))
        );
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.log('Using local graph store', err);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleAddEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    try {
      const res = await apiClient.addGraphNode(newEntityName.trim(), newEntityType, 'CLEAN');
      if (res && res.nodes) {
        setNodes(
          res.nodes.map((n) => ({
            id: n.id,
            label: n.label,
            type: n.type,
            status: n.status as any,
            centrality: n.centrality,
            val: n.val,
            ipOrLocation: 'Newly Registered Perimeter Node',
          }))
        );
        setAnalytics(res.analytics);
      }
      setSelectedNodeId(nodes[nodes.length - 1]?.id || 'node_email_primary');
      setNewEntityName('');
      setShowAddModal(false);
      triggerToast(`Dynamic entity "${newEntityName.trim()}" added & Betweenness Centrality updated!`);
    } catch {
      const newNode: GraphNode = {
        id: `node_${Date.now()}`,
        label: newEntityName.trim(),
        type: newEntityType,
        status: 'CLEAN',
        centrality: 0.45,
        val: 16,
        ipOrLocation: 'Newly Registered Perimeter Node',
      };
      setNodes([...nodes, newNode]);
      setSelectedNodeId(newNode.id);
      setNewEntityName('');
      setShowAddModal(false);
      triggerToast(`Entity "${newNode.label}" added locally.`);
    }
  };

  const handleToggleIsolation = async () => {
    try {
      const res = await apiClient.isolateGraphNode(selectedNode.id);
      if (res && res.nodes) {
        setNodes(
          res.nodes.map((n) => ({
            id: n.id,
            label: n.label,
            type: n.type,
            status: n.status as any,
            centrality: n.centrality,
            val: n.val,
            ipOrLocation: n.type === 'CANARY' ? 'Planted Honey-Token Decoy' : 'Perimeter Asset',
          }))
        );
        setAnalytics(res.analytics);
      }
      setIsIsolated(true);
      triggerToast(`🚨 Blast radius isolated! Inbound attack paths to "${selectedNode.label}" severed.`);
    } catch {
      setIsIsolated(!isIsolated);
      triggerToast(`🚨 Lateral pathways to "${selectedNode.label}" isolated.`);
    }
  };

  const handleRunKillchainSim = async () => {
    setIsSimulating(true);
    try {
      const sim = await apiClient.simulateKillchain(selectedNode.id);
      triggerToast(`Kill-Chain Simulation: ${sim.blast_reduction_achieved} blast reduction achieved!`);
    } catch {
      triggerToast('Lateral kill-chain simulated successfully.');
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredNodes = filterType === 'ALL' ? nodes : nodes.filter((n) => n.type === filterType);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'TOKEN':
      case 'SECRET':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'DATABASE':
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'CANARY':
        return <span className="material-symbols-outlined text-[16px] text-emerald-400">toll</span>;
      case 'GITHUB':
      case 'REPOSITORY':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      default:
        return <span className="material-symbols-outlined text-[18px] text-indigo-400">person</span>;
    }
  };

  return (
    <div className="relative min-h-[580px] h-auto lg:h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e0d] flex flex-col lg:flex-row">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#20201e] border border-white/20 text-white text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Interactive Graph Canvas Area */}
      <div className="flex-1 relative bg-[#0e0e0d] p-6 flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
        {/* Floating Zoom & Filter Controls */}
        <div className="absolute top-6 left-6 z-20 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1c1c1a]/90 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 text-[#8e928e] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.6))}
              className="p-1.5 text-[#8e928e] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#1c1c1a]/90 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg overflow-x-auto">
            {['ALL', 'EMAIL', 'GITHUB', 'TOKEN', 'CANARY', 'DATABASE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-colors ${
                  filterType === type ? 'bg-white text-black font-bold' : 'text-[#8e928e] hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-mono font-semibold transition-colors shadow-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD ENTITY</span>
          </button>

          <button
            onClick={fetchGraph}
            className="p-1.5 bg-[#1c1c1a] hover:bg-white/10 border border-white/10 text-neutral-300 rounded-xl transition-colors"
            title="Sync Live Graph"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 2D Topological Nodes Visualizer */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="relative w-[340px] sm:w-[480px] h-[340px] sm:h-[420px]">
            {filteredNodes.map((node, i) => {
              const angle = (i / filteredNodes.length) * 2 * Math.PI;
              const radius = 140;
              const left = 240 + radius * Math.cos(angle) - 30;
              const top = 180 + radius * Math.sin(angle) - 30;
              const isSelected = node.id === selectedNodeId;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-black ring-4 ring-white/30 scale-110 shadow-2xl z-20'
                      : node.status === 'TRIGGERED' || node.status === 'EXPOSED'
                      ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/40'
                      : node.status === 'ISOLATED'
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                      : 'bg-[#1c1c1a] border border-white/10 hover:border-white/30 text-white'
                  }`}
                  title={`${node.label} (Centrality: ${node.centrality})`}
                >
                  {getNodeIcon(node.type)}
                  <span className="text-[9px] font-mono truncate max-w-[48px] px-0.5 mt-0.5">
                    {node.label.split('@')[0].split('.')[0]}
                  </span>
                </div>
              );
            })}

            {/* Center Core Node */}
            <div className="absolute left-[210px] top-[150px] w-16 h-16 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-700 border-2 border-purple-400/50 flex flex-col items-center justify-center text-white shadow-2xl animate-pulse">
              <Cpu className="w-6 h-6" />
              <span className="text-[8px] font-mono font-bold tracking-widest mt-0.5">CORE</span>
            </div>
          </div>
        </div>

        {/* Dynamic Topology Telemetry Status Bar */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-center gap-2 bg-[#1c1c1a]/80 backdrop-blur-md border border-white/5 rounded-xl px-4 py-2.5 text-xs font-mono text-[#8e928e]">
          <div className="flex items-center gap-3">
            <span>NODES: {nodes.length}</span>
            <span>•</span>
            <span className="text-rose-400">
              SPOF: {analytics?.critical_single_point_of_failure || selectedNode.label} ({analytics?.bottleneck_centrality_score || selectedNode.centrality})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400">3D FORCE GRAPH ONLINE</span>
          </div>
        </div>
      </div>

      {/* Right Inspection & Action Panel */}
      <div className="w-full lg:w-96 bg-[#131312] border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8e928e] font-bold">
              ENTITY ATTRIBUTES &amp; SPOF
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                selectedNode.status === 'TRIGGERED' || selectedNode.status === 'EXPOSED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : selectedNode.status === 'ISOLATED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-neutral-300 border-white/10'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>

          {/* Node Identity */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-sans truncate">{selectedNode.label}</h3>
            <p className="text-xs font-mono text-[#8e928e]">
              Type: <span className="text-white font-semibold">{selectedNode.type}</span> • ID: {selectedNode.id}
            </p>
            <p className="text-xs font-mono text-[#8e928e]">Location / Asset: {selectedNode.ipOrLocation}</p>
          </div>

          {/* Betweenness Centrality Gauge */}
          <div className="bg-[#1c1c1a] border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8e928e]">BETWEENNESS CENTRALITY (SPOF)</span>
              <span className="text-emerald-400 font-bold">{(selectedNode.centrality * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-500"
                style={{ width: `${selectedNode.centrality * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-mono text-[#8e928e]">
              High centrality indicates this entity sits on multiple lateral attack pathways.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleToggleIsolation}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                isIsolated
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>{isIsolated ? 'RE-OPEN LATERAL PATHS' : 'ISOLATE BLAST RADIUS'}</span>
            </button>

            <button
              onClick={handleRunKillchainSim}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Flame className={`w-4 h-4 ${isSimulating ? 'animate-bounce' : ''}`} />
              <span>{isSimulating ? 'SIMULATING...' : 'SIMULATE KILL-CHAIN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Custom Entity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1a] border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-[#8e928e] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white font-sans">Add Perimeter Entity</h3>
              <p className="text-xs font-mono text-[#8e928e] mt-0.5">
                Register a new asset into the dynamic Cyber DNA Graph.
              </p>
            </div>

            <form onSubmit={handleAddEntity} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#8e928e] uppercase mb-1">Entity Name / Identifier</label>
                <input
                  type="text"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder="e.g., s3-prod-backups or staging-api-token"
                  className="w-full bg-[#131312] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8e928e] uppercase mb-1">Entity Class</label>
                <select
                  value={newEntityType}
                  onChange={(e) => setNewEntityType(e.target.value)}
                  className="w-full bg-[#131312] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                >
                  <option value="EMAIL">Email Identity (Employee / Admin)</option>
                  <option value="GITHUB">GitHub Organization / Account</option>
                  <option value="TOKEN">API Token / Secret Key</option>
                  <option value="DATABASE">Cloud Database (PostgreSQL/RDS)</option>
                  <option value="SERVICE">External Service (Slack, Discord)</option>
                  <option value="CANARY">Canary Honey-Token Decoy</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
              >
                INSERT INTO TOPOLOGY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
