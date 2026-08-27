import { ENV } from '../config/env';

const API_BASE = ENV.API_URL;

export interface DashboardTelemetry {
  activeIdentities: number;
  criticalExposures: number;
  activeCanaryTripwires: number;
  averageBlastRadius: number;
  betweennessSPOF: string;
  totalIncidents?: number;
}

export interface CanaryItem {
  id: string;
  name: string;
  type: 'AWS_KEY' | 'GITHUB_PAT' | 'DATABASE_URL' | 'SLACK_WEBHOOK' | 'OPENAI_KEY';
  tokenValue: string;
  memo: string;
  status: 'ARMED' | 'TRIGGERED' | 'REVOKED';
  createdAt: string;
  detonatedAt?: string;
}

export interface ThreatIncident {
  id: string;
  title?: string;
  type?: string;
  target?: string;
  affected_asset?: string;
  source?: string;
  evidence_source?: string;
  severity?: string;
  status?: string;
  time?: string;
  created_at?: string;
  isCritical?: boolean;
  ai_risk_score?: number;
  attack_path_summary?: string;
  recovery_actions?: Array<{ id: string; title: string; stage: string; is_completed: boolean }>;
}

export interface CyberDnaGraphData {
  nodes: Array<{ id: string; label: string; type: string; status: string; centrality: number; val: number }>;
  links: Array<{ source: string; target: string; relationship: string; weight: number }>;
  analytics: {
    critical_single_point_of_failure: string;
    bottleneck_centrality_score: number;
    lateral_attack_path: string[];
    blast_radius_node_count: number;
    recommendation: string;
  };
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('anveshak_jwt');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(error.detail || `HTTP Error ${response.status}`);
    }
    return response.json();
  }

  // 1. Dashboard & Telemetry Metrics
  async getDashboardTelemetry(): Promise<DashboardTelemetry> {
    try {
      const data = await this.request<any>('/tasks/metrics');
      return {
        activeIdentities: data.active_identities ?? 7,
        criticalExposures: data.critical_leaks ?? 1,
        activeCanaryTripwires: data.canaries_armed ?? 2,
        averageBlastRadius: Math.round((data.spof_score || 0.88) * 100),
        betweennessSPOF: `${data.spof_label || 'admin@anveshaksutra.corp'} (${data.spof_score || 0.88})`,
        totalIncidents: data.total_incidents,
      };
    } catch {
      return {
        activeIdentities: 7,
        criticalExposures: 1,
        activeCanaryTripwires: 2,
        averageBlastRadius: 78,
        betweennessSPOF: 'admin@anveshaksutra.corp (0.88)',
      };
    }
  }

  // 2. Cyber DNA Graph
  async getCyberDnaGraph(): Promise<CyberDnaGraphData> {
    return await this.request<CyberDnaGraphData>('/cyber-dna');
  }

  async addGraphNode(label: string, nodeType: string, status: string = 'CLEAN'): Promise<CyberDnaGraphData> {
    return await this.request<CyberDnaGraphData>('/cyber-dna/nodes', {
      method: 'POST',
      body: JSON.stringify({ label, node_type: nodeType, status }),
    });
  }

  async isolateGraphNode(nodeId: string): Promise<CyberDnaGraphData> {
    return await this.request<CyberDnaGraphData>(`/cyber-dna/isolate/${nodeId}`, {
      method: 'POST',
    });
  }

  async simulateKillchain(targetNodeId: string = 'node_email_primary'): Promise<any> {
    return await this.request<any>(`/cyber-dna/simulate-killchain?target_node_id=${encodeURIComponent(targetNodeId)}`, {
      method: 'POST',
    });
  }

  async classifyEntropy(token: string): Promise<any> {
    return await this.request<any>(`/cyber-dna/classify-entropy?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    });
  }

  // 3. Canary Studio (Honey Tokens)
  async getCanaries(): Promise<CanaryItem[]> {
    try {
      const data = await this.request<any[]>('/canaries');
      return data.map((c) => ({
        id: c.id,
        name: c.name || c.memo || 'Canary Honey-Token',
        type: c.token_type || 'AWS_KEY',
        tokenValue: c.token_value || 'AKIA_CANARY_04_HEX',
        memo: c.memo || 'Production decoy',
        status: c.status || 'ARMED',
        createdAt: c.created_at || 'Recently',
        detonatedAt: c.detonated_at,
      }));
    } catch {
      return [];
    }
  }

  async createCanary(payload: { label: string; type: string }): Promise<CanaryItem> {
    const res = await this.request<any>('/canaries', {
      method: 'POST',
      body: JSON.stringify({
        token_type: payload.type,
        label: payload.label,
      }),
    });
    return {
      id: res.id,
      name: res.name || payload.label,
      type: res.token_type,
      tokenValue: res.token_value,
      memo: res.memo,
      status: res.status,
      createdAt: res.created_at,
    };
  }

  async detonateCanary(canaryId: string): Promise<any> {
    return await this.request<any>(`/canaries/${canaryId}/detonate`, {
      method: 'POST',
    });
  }

  async deleteCanary(canaryId: string): Promise<any> {
    return await this.request<any>(`/canaries/${canaryId}`, {
      method: 'DELETE',
    });
  }

  // 4. OSINT Sweeps
  async triggerSweep(target: string, deepScan: boolean = true): Promise<any> {
    return await this.request<any>('/tasks/trigger-sweep', {
      method: 'POST',
      body: JSON.stringify({ target, deep_scan: deepScan }),
    });
  }

  // 5. Threat Incidents
  async getIncidents(): Promise<ThreatIncident[]> {
    try {
      const data = await this.request<any[]>('/incidents');
      return data.map((inc) => ({
        id: inc.id,
        title: inc.title || 'Credential Exposure Incident',
        type: inc.title || 'CREDENTIAL LEAK',
        target: inc.affected_asset || 'admin@anveshaksutra.corp',
        affected_asset: inc.affected_asset,
        source: inc.evidence_source || 'OSINT Feed',
        evidence_source: inc.evidence_source,
        severity: inc.severity || 'HIGH',
        status: inc.status || 'ACTION_REQUIRED',
        time: inc.created_at || 'Today',
        created_at: inc.created_at,
        isCritical: inc.severity === 'CRITICAL' || inc.status === 'ACTION_REQUIRED',
        ai_risk_score: inc.ai_risk_score || 0.85,
        attack_path_summary: inc.attack_path_summary,
        recovery_actions: inc.recovery_actions || [],
      }));
    } catch {
      return [];
    }
  }

  async resolveIncident(incidentId: string): Promise<any> {
    return await this.request<any>(`/incidents/${incidentId}/resolve`, {
      method: 'POST',
    });
  }

  async deleteIncident(incidentId: string): Promise<any> {
    return await this.request<any>(`/incidents/${incidentId}`, {
      method: 'DELETE',
    });
  }

  // 6. Zero-Knowledge k-Anonymity & Deep Dark Web Lookup
  async lookupKAnonymityPrefix(prefix5: string): Promise<any> {
    return await this.request<any>(`/identities/k-lookup/${prefix5.toLowerCase()}`);
  }

  async deepDarkWebSearch(query: string, deepScan: boolean = true): Promise<any> {
    return await this.request<any>('/identities/deep-dark-web-search', {
      method: 'POST',
      body: JSON.stringify({ query, deep_scan: deepScan }),
    });
  }

  // 7. Active Verification Probes
  async verifyProbe(verificationType: string, token: string): Promise<{ status: string; is_active: boolean; message: string }> {
    return await this.request('/recovery/verify-probe', {
      method: 'POST',
      body: JSON.stringify({ verification_type: verificationType, test_payload: { token } }),
    });
  }

  // 8. Forensic Audit Reports
  async getForensicSummary(): Promise<any> {
    return await this.request<any>('/reports/forensic-summary');
  }

  // 9. Simulation Controls
  async triggerSimulation(): Promise<{ status: string; is_attack_active: boolean }> {
    return await this.request('/simulation/trigger-attack', { method: 'POST' });
  }

  async resetSimulation(): Promise<{ status: string }> {
    return await this.request('/simulation/reset', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();
