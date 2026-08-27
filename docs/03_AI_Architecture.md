# AnveshakSutra — 03. AI & On-Device ONNX Architecture

---

## 1. Core Philosophy: Why On-Device AI?

Sending sensitive breach records, user account mappings, and raw token snippets to remote cloud LLMs (e.g. OpenAI, Anthropic) directly violates zero-knowledge user privacy. 

AnveshakSutra solves this through an **On-Device Hybrid Intelligence Architecture**:
1. **Model Development in Python:** Models are researched, trained, and evaluated using Python's mature data science stack (`PyTorch`, `scikit-learn`, `Sentence Transformers`).
2. **ONNX Export & Quantization:** Models are converted into the Open Neural Network Exchange (**ONNX**) format and quantized (INT8/FP16) to reduce file sizes to `< 25MB`.
3. **In-Browser Execution via ONNX Runtime Web:** The client browser downloads the static model weights and executes inference locally using hardware acceleration (**WebGPU / WebAssembly**).
4. **Hybrid Rule-Bounded Inference:** A deterministic security rule engine sets hard severity boundaries to eliminate hallucinations or probabilistic omissions.

```
       MODEL DEVELOPMENT & TRAINING PIPELINE (Python Environment)
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Labeled Threat   │ ──► │ PyTorch Model    │ ──► │ ONNX Export      │ ──► │ INT8 Quantize    │
│ Dataset (Curated)│     │ Training & Eval  │     │ (torch.onnx)     │     │ & Hash Sign      │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                                                    │
                                                                   HTTPS Download   │
                                                                                    ▼
       BROWSER INFERENCE PIPELINE (Client-Side Privacy Zone)
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Encrypted Breach │ ──► │ Local Feature    │ ──► │ ONNX Runtime Web │ ──► │ Hybrid Risk      │
│ Decrypted in Mem │     │ Extractor        │     │ (WebGPU / WASM)  │     │ + Damage Playbook│
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 2. On-Device Models Specifications

### Model A: Exposure Severity & Attack Category Classifier (`threat_classifier.onnx`)
- **Input:** 32-dimensional feature vector derived from breach metadata:
  - `has_plaintext_password` (binary)
  - `has_password_hash` (binary)
  - `has_api_key_or_token` (binary)
  - `has_pii` (email, phone, address counts)
  - `source_reliability_score` (float [0.0, 1.0])
  - `breach_age_days` (normalized log float)
  - `cyber_dna_node_degree` (integer, graph centrality)
  - `credential_reuse_indicator` (binary)
- **Output:**
  - `severity_tier`: `[LOW, MEDIUM, HIGH, CRITICAL]` (Softmax probability distribution)
  - `primary_threat_type`: `[CREDENTIAL_STUFFING, REPO_POISONING, ATO, SOCIAL_ENGINEERING, API_ABUSE]`
- **Model Architecture:** Lightweight Multi-Layer Perceptron (MLP) / Gradient Boosted Decision Tree exported via `onnxmltools` (Size: ~1.2 MB).

### Model B: Cyber DNA Lateral Path Predictor (`path_predictor.onnx`)
- **Input:** Subgraph adjacency tensor + node type embeddings.
- **Output:** Predicted exploit escalation probability along adjacent Cyber DNA edges (e.g. `Email -> Shared Domain -> GitHub Admin -> AWS Token`).
- **Model Size:** ~4.5 MB.

---

## 3. Hybrid AI + Rules Engine

Machine learning output never operates as an unchecked black box. The platform evaluates deterministic security rules first:

```
                          INGESTED INCIDENT DATA
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  Deterministic Security Guardrails   │
                 │  • If active AWS/GitHub secret:      │
                 │    HARD OVERRIDE -> CRITICAL         │
                 │  • If historical unhashed forum dump:│
                 │    HARD BOUND -> LOW / MEDIUM        │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  ONNX Runtime Web Model Inference    │
                 │  • Predicts attack vector likelihood │
                 │  • Scores cascading Cyber DNA risk   │
                 │  • Recommends mitigation priority    │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  Explainable Natural-Language Output │
                 │  "CRITICAL: Active token exposed in  │
                 │   public repo. Immediate ATO risk."  │
                 └──────────────────────────────────────┘
```

---

## 4. Browser Execution Implementation

```typescript
// frontend/ai/threat_analyzer.ts
import * as ort from 'onnxruntime-web';

export class OnDeviceThreatAnalyzer {
  private session: ort.InferenceSession | null = null;

  async initialize(): Promise<void> {
    // Configure WebGPU backend with WebAssembly fallback
    ort.env.wasm.numThreads = 2;
    ort.env.wasm.simd = true;

    try {
      this.session = await ort.InferenceSession.create('/models/threat_classifier.onnx', {
        executionProviders: ['webgpu', 'wasm'],
      });
      console.log('ONNX Runtime Web initialized with hardware acceleration.');
    } catch (e) {
      console.warn('WebGPU unavailable, falling back to CPU WebAssembly:', e);
      this.session = await ort.InferenceSession.create('/models/threat_classifier.onnx', {
        executionProviders: ['wasm'],
      });
    }
  }

  async predictSeverity(features: Float32Array): Promise<{ severity: string; score: number }> {
    if (!this.session) await this.initialize();
    
    const tensor = new ort.Tensor('float32', features, [1, features.length]);
    const feeds = { input: tensor };
    const results = await this.session!.run(feeds);
    
    const probabilities = results.output.data as Float32Array;
    const severityClasses = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    let maxIdx = 0;
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > probabilities[maxIdx]) maxIdx = i;
    }

    return {
      severity: severityClasses[maxIdx],
      score: probabilities[maxIdx],
    };
  }
}
```

---

## 5. Graceful Degradation & Integrity Verification

1. **Subresource Integrity (SRI) & Hash Verification:**
   - Every downloaded ONNX model binary is checked against a cryptographic SHA-256 digest embedded in the application build manifest before loading into memory.
2. **Offline & Low-End Device Support:**
   - If WebGPU or WASM fails, or memory limit triggers, the system gracefully falls back to the deterministic security rules engine, displaying:
   `"Local AI model unavailable. Deterministic security analysis is active."`
   - **Under no circumstance is sensitive data offloaded to a cloud AI endpoint.**
