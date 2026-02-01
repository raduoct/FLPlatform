import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import StudyViewer from "../components/StudyViewer";
import { useNodeState } from "../state/NodeState";
import { useRouter } from "next/router";

export default function InferencePage() {
  const { studies, models, runInference, lastInference } = useNodeState();
  const router = useRouter();

  const deployed = models.find(m => m.status === "deployed");
  const [studyId, setStudyId] = useState<string>(studies[0]?.study_id ?? "");
  const [modelId, setModelId] = useState<string>(deployed?.model_id ?? models[0]?.model_id ?? "");

  useEffect(() => {
    const fromQuery = router.query.study_id;
    if (typeof fromQuery === "string") setStudyId(fromQuery);
  }, [router.query.study_id]);

  const selectedStudy = useMemo(() => studies.find(s => s.study_id === studyId), [studies, studyId]);

  return (
    <Box>
      <SectionHeader title="Inference" subtitle="Select a study and model, then run inference (simulated)." />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          fullWidth
          label="Study"
          value={studyId}
          onChange={(e) => setStudyId(e.target.value)}
        >
          {studies.map(s => (
            <MenuItem key={s.study_id} value={s.study_id}>
              {s.study_id} — {s.filename}
            </MenuItem>
          ))}
        </TextField>

        <TextField select fullWidth label="Model" value={modelId} onChange={(e) => setModelId(e.target.value)}>
          {models.map(m => (
            <MenuItem key={m.model_id} value={m.model_id}>
              {m.model_id} • {m.origin} • {m.status}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={() => runInference(studyId, modelId)} sx={{ minWidth: 160 }}>
          Run
        </Button>
      </Stack>

      {selectedStudy && (
        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Selected Study
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {selectedStudy.study_id} — {selectedStudy.filename} • Label: {selectedStudy.label ?? "Unlabeled"}
            </Typography>
          </CardContent>
        </Card>
      )}

      {lastInference ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" }, gap: 2 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Result
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5 }}>
                {lastInference.predicted_label}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Confidence: <b>{(lastInference.confidence * 100).toFixed(0)}%</b>
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Latency: {lastInference.latency_ms} ms
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Model: {lastInference.model_id}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Time: {new Date(lastInference.created_at).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                Visualization
              </Typography>
              <StudyViewer baseUrl={lastInference.image_urls.base} overlayUrl={lastInference.image_urls.overlay} />
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Run inference to see results.
        </Typography>
      )}
    </Box>
  );
}
