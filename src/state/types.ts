export type JobKind = "train" | "eval" | "infer" | "federated_submit" | "pull_global";
export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type Job = {
  job_id: string;
  kind: JobKind;
  status: JobStatus;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  message?: string;
  result?: any;
};

export type Study = {
  study_id: string;
  filename: string;
  image_url?: string;
  overlay_url?: string;
  label?: "PNEUMONIA" | "NORMAL";
  split?: "train" | "val" | "test";
  added_at: string;
};

export type ModelSummary = {
  model_id: string;
  origin: "global" | "local";
  name: string;
  version: string;
  hash: string;
  created_at: string;
  status: "deployed" | "candidate" | "archived";
  metrics?: {
    f1?: number;
    auc?: number;
    sensitivity?: number;
    specificity?: number;
  };
};

export type InferenceResult = {
  inference_id: string;
  study_id: string;
  model_id: string;
  predicted_label: "PNEUMONIA" | "NORMAL";
  confidence: number;
  latency_ms: number;
  created_at: string;
  image_urls: {
    base: string;
    overlay?: string;
  };
};

export type FederatedPlan = {
  round_id: string;
  global_model_id: string;
  task: string;
  epochs: number;
  lr: number;
  created_at: string;
};

export type FederatedRound = {
  round_id: string;
  status: "plan_received" | "training" | "submitted" | "accepted" | "rejected";
  submitted_at?: string;
  decided_at?: string;
  notes?: string;
};
