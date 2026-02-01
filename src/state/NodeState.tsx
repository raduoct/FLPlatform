import React, { createContext, useContext, useMemo, useState } from "react";
import { FederatedPlan, FederatedRound, InferenceResult, Job, ModelSummary, Study } from "./types";
import { seedInference, seedJobs, seedModels, seedPlan, seedRounds, seedStudies } from "../mock/seed";

type NodeInfo = {
  node_id: string;
  healthy: boolean;
  uptime_sec: number;
  gpu: { available: boolean; name: string; mem_total_mb: number; mem_used_mb: number };
  disk: { used_gb: number; total_gb: number };
};

type NodeStateShape = {
  node: NodeInfo;
  studies: Study[];
  models: ModelSummary[];
  jobs: Job[];
  lastInference?: InferenceResult;
  fedPlan?: FederatedPlan;
  fedRounds: FederatedRound[];

  // actions
  uploadStudiesMock(count?: number): void;
  runInference(study_id: string, model_id: string): void;
  startTraining(base_model_id: string, epochs: number, lr: number): void;
  promoteModel(model_id: string): void;
  rollbackTo(model_id: string): void;

  pullFederatedPlan(): void;
  trainAndSubmitFederated(): void;
};

const NodeStateContext = createContext<NodeStateShape | null>(null);

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 1e6).toString().padStart(6, "0")}`;
}

export function NodeStateProvider({ children }: { children: React.ReactNode }) {
  const [node] = useState<NodeInfo>({
    node_id: "hospital_a",
    healthy: true,
    uptime_sec: 52341,
    gpu: { available: true, name: "NVIDIA RTX (PoC)", mem_total_mb: 12288, mem_used_mb: 2048 },
    disk: { used_gb: 18, total_gb: 256 }
  });

  const [studies, setStudies] = useState<Study[]>(seedStudies);
  const [models, setModels] = useState<ModelSummary[]>(seedModels);
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [lastInference, setLastInference] = useState<InferenceResult | undefined>(seedInference);
  const [fedPlan, setFedPlan] = useState<FederatedPlan | undefined>(undefined);
  const [fedRounds, setFedRounds] = useState<FederatedRound[]>(seedRounds);

  const deployedModel = useMemo(() => models.find(m => m.status === "deployed"), [models]);

  const uploadStudiesMock = (count = 3) => {
    const base = studies.length + 1000;
    const newOnes: Study[] = Array.from({ length: count }).map((_, i) => ({
      study_id: `S-${base + i}`,
      filename: `uploaded_${base + i}.png`,
      label: Math.random() > 0.5 ? "PNEUMONIA" : "NORMAL",
      split: (["train", "val", "test"] as const)[Math.floor(Math.random() * 3)],
      added_at: nowIso()
    }));
    setStudies(prev => [...newOnes, ...prev]);
  };

  const runInference = (study_id: string, model_id: string) => {
    const job_id = id("J");
    const created_at = nowIso();
    setJobs(prev => [{ job_id, kind: "infer", status: "queued", created_at, message: "Queued inference" }, ...prev]);

    // simulate queue -> running -> done
    setTimeout(() => {
      setJobs(prev => prev.map(j => (j.job_id === job_id ? { ...j, status: "running", started_at: nowIso(), message: "Running inference" } : j)));
    }, 500);

    setTimeout(() => {
      const pred = Math.random() > 0.5 ? "PNEUMONIA" : "NORMAL";
      const conf = Math.round((0.6 + Math.random() * 0.39) * 100) / 100;

      const inf: InferenceResult = {
        inference_id: id("I"),
        study_id,
        model_id,
        predicted_label: pred,
        confidence: conf,
        latency_ms: 180 + Math.floor(Math.random() * 120),
        created_at: nowIso(),
        image_urls: {
          base: "https://images.unsplash.com/photo-1582719478185-2f293d8ae52a?auto=format&fit=crop&w=1200&q=60",
          overlay: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=60"
        }
      };

      setLastInference(inf);
      setJobs(prev =>
        prev.map(j =>
          j.job_id === job_id ? { ...j, status: "succeeded", finished_at: nowIso(), message: "Inference completed", result: inf } : j
        )
      );
    }, 1600);
  };

  const startTraining = (base_model_id: string, epochs: number, lr: number) => {
    const job_id = id("J");
    setJobs(prev => [{ job_id, kind: "train", status: "queued", created_at: nowIso(), message: "Queued training" }, ...prev]);

    setTimeout(() => {
      setJobs(prev => prev.map(j => (j.job_id === job_id ? { ...j, status: "running", started_at: nowIso(), message: "Training in progress" } : j)));
    }, 600);

    setTimeout(() => {
      const newModel: ModelSummary = {
        model_id: id("M-local"),
        origin: "local",
        name: "cxr-pneumonia",
        version: "0.1.0-local",
        hash: Math.random().toString(16).slice(2, 10),
        created_at: nowIso(),
        status: "candidate",
        metrics: {
          f1: Math.round((0.8 + Math.random() * 0.1) * 100) / 100,
          auc: Math.round((0.86 + Math.random() * 0.08) * 100) / 100,
          sensitivity: Math.round((0.82 + Math.random() * 0.1) * 100) / 100,
          specificity: Math.round((0.78 + Math.random() * 0.12) * 100) / 100
        }
      };
      setModels(prev => [newModel, ...prev]);

      setJobs(prev =>
        prev.map(j =>
          j.job_id === job_id
            ? { ...j, status: "succeeded", finished_at: nowIso(), message: `Training done (base: ${base_model_id}, epochs: ${epochs}, lr: ${lr})`, result: newModel }
            : j
        )
      );
    }, 3200);
  };

  const promoteModel = (model_id: string) => {
    setModels(prev =>
      prev.map(m => {
        if (m.model_id === model_id) return { ...m, status: "deployed" };
        if (m.status === "deployed") return { ...m, status: "archived" };
        return m;
      })
    );
  };

  const rollbackTo = (model_id: string) => {
    promoteModel(model_id);
  };

  const pullFederatedPlan = () => {
    const job_id = id("J");
    setJobs(prev => [{ job_id, kind: "pull_global", status: "running", created_at: nowIso(), started_at: nowIso(), message: "Pulling federated plan" }, ...prev]);

    setTimeout(() => {
      setFedPlan(seedPlan);
      setFedRounds(prev => [{ round_id: seedPlan.round_id, status: "plan_received" }, ...prev]);
      setJobs(prev => prev.map(j => (j.job_id === job_id ? { ...j, status: "succeeded", finished_at: nowIso(), message: "Plan received" } : j)));
    }, 900);
  };

  const trainAndSubmitFederated = () => {
    if (!fedPlan || !deployedModel) return;

    const round_id = fedPlan.round_id;
    const job_id = id("J");
    setJobs(prev => [{ job_id, kind: "federated_submit", status: "running", created_at: nowIso(), started_at: nowIso(), message: "Training (federated) and submitting update" }, ...prev]);
    setFedRounds(prev => prev.map(r => (r.round_id === round_id ? { ...r, status: "training" } : r)));

    setTimeout(() => {
      setFedRounds(prev =>
        prev.map(r => (r.round_id === round_id ? { ...r, status: "submitted", submitted_at: nowIso(), notes: "Update uploaded" } : r))
      );
    }, 1400);

    setTimeout(() => {
      const accepted = Math.random() > 0.25;
      setFedRounds(prev =>
        prev.map(r =>
          r.round_id === round_id
            ? { ...r, status: accepted ? "accepted" : "rejected", decided_at: nowIso(), notes: accepted ? "Update accepted" : "Update rejected" }
            : r
        )
      );
      setJobs(prev => prev.map(j => (j.job_id === job_id ? { ...j, status: "succeeded", finished_at: nowIso(), message: "Federated submission complete" } : j)));
    }, 2800);
  };

  const value: NodeStateShape = {
    node,
    studies,
    models,
    jobs,
    lastInference,
    fedPlan,
    fedRounds,
    uploadStudiesMock,
    runInference,
    startTraining,
    promoteModel,
    rollbackTo,
    pullFederatedPlan,
    trainAndSubmitFederated
  };

  return <NodeStateContext.Provider value={value}>{children}</NodeStateContext.Provider>;
}

export function useNodeState() {
  const ctx = useContext(NodeStateContext);
  if (!ctx) throw new Error("useNodeState must be used within NodeStateProvider");
  return ctx;
}
