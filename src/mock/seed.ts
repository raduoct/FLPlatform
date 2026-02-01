import { FederatedPlan, FederatedRound, InferenceResult, Job, ModelSummary, Study } from "../state/types";

export const seedStudies: Study[] = [
  { study_id: "S-1001", filename: "patient_001.png", label: "PNEUMONIA", split: "train", added_at: new Date().toISOString() },
  { study_id: "S-1002", filename: "patient_002.png", label: "NORMAL", split: "train", added_at: new Date().toISOString() },
  { study_id: "S-1003", filename: "patient_003.png", label: "PNEUMONIA", split: "val", added_at: new Date().toISOString() },
  { study_id: "S-1004", filename: "patient_004.png", label: "NORMAL", split: "test", added_at: new Date().toISOString() }
];

// Use public placeholder images for PoC UI visuals
const baseImg = "https://images.unsplash.com/photo-1582719478185-2f293d8ae52a?auto=format&fit=crop&w=900&q=60";
const overlayImg = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60";

export const seedModels: ModelSummary[] = [
  {
    model_id: "M-global-001",
    origin: "global",
    name: "cxr-pneumonia",
    version: "0.1.0",
    hash: "a1b2c3d4",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "deployed",
    metrics: { f1: 0.82, auc: 0.88, sensitivity: 0.84, specificity: 0.79 }
  },
  {
    model_id: "M-local-002",
    origin: "local",
    name: "cxr-pneumonia",
    version: "0.1.0-local",
    hash: "d4c3b2a1",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "candidate",
    metrics: { f1: 0.85, auc: 0.90, sensitivity: 0.86, specificity: 0.83 }
  }
];

export const seedJobs: Job[] = [
  {
    job_id: "J-9001",
    kind: "infer",
    status: "succeeded",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    started_at: new Date(Date.now() - 1000 * 60 * 30 + 2000).toISOString(),
    finished_at: new Date(Date.now() - 1000 * 60 * 30 + 3500).toISOString(),
    message: "Inference completed"
  }
];

export const seedInference: InferenceResult = {
  inference_id: "I-5001",
  study_id: "S-1003",
  model_id: "M-global-001",
  predicted_label: "PNEUMONIA",
  confidence: 0.91,
  latency_ms: 210,
  created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  image_urls: { base: baseImg, overlay: overlayImg }
};

export const seedPlan: FederatedPlan = {
  round_id: "R-2026-02-01-001",
  global_model_id: "M-global-001",
  task: "pneumonia_classification",
  epochs: 1,
  lr: 1e-4,
  created_at: new Date().toISOString()
};

export const seedRounds: FederatedRound[] = [
  { round_id: "R-2026-01-31-001", status: "accepted", submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), decided_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() }
];
