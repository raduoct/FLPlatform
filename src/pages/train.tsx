import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import JobsTable from "../components/JobsTable";
import { useNodeState } from "../state/NodeState";

export default function TrainPage() {
  const { models, startTraining, jobs } = useNodeState();
  const deployed = models.find(m => m.status === "deployed");
  const [baseModelId, setBaseModelId] = useState(deployed?.model_id ?? models[0]?.model_id ?? "");
  const [epochs, setEpochs] = useState(2);
  const [lr, setLr] = useState(1e-4);

  const trainJobs = useMemo(() => jobs.filter(j => j.kind === "train"), [jobs]);

  return (
    <Box>
      <SectionHeader title="Train" subtitle="Start a local training job (simulated), track progress, and create a candidate model." />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField select fullWidth label="Base model" value={baseModelId} onChange={(e) => setBaseModelId(e.target.value)}>
          {models.map(m => (
            <MenuItem key={m.model_id} value={m.model_id}>
              {m.model_id} • {m.origin} • {m.status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Epochs"
          type="number"
          value={epochs}
          onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
          fullWidth
          inputProps={{ min: 1, max: 20 }}
        />

        <TextField
          label="Learning rate"
          type="number"
          value={lr}
          onChange={(e) => setLr(parseFloat(e.target.value))}
          fullWidth
          inputProps={{ step: 1e-5 }}
        />

        <Button variant="contained" sx={{ minWidth: 200 }} onClick={() => startTraining(baseModelId, epochs, lr)}>
          Start training
        </Button>
      </Stack>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Recent training jobs
      </Typography>
      <JobsTable jobs={trainJobs} />
    </Box>
  );
}
